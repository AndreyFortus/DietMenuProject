import numpy as np


def pivot_step(tableau, pivot_row, pivot_col):
    pivot_val = tableau[pivot_row, pivot_col]
    if abs(pivot_val) < 1e-12:
        raise ZeroDivisionError('Pivot value almost 0.')
    tableau[pivot_row, :] /= pivot_val
    for r in range(tableau.shape[0]):
        if r != pivot_row:
            tableau[r, :] -= tableau[r, pivot_col] * tableau[pivot_row, :]


def find_entering_var(tableau, tol=1e-9):
    obj = tableau[-1, :-1]
    max_val = np.max(obj)
    if max_val <= tol:
        return None
    return int(np.argmax(obj))


def find_leaving_var(tableau, pivot_col, tol=1e-12):
    col = tableau[:-1, pivot_col]
    rhs = tableau[:-1, -1]
    ratios = [rhs[i] / col[i] if col[i] > tol else np.inf for i in range(len(col))]
    m = np.min(ratios)
    if np.isinf(m):
        return None
    return int(np.argmin(ratios))


def build_tableau_M(A, b, c_minimize, ineq_sense):
    m, n = A.shape
    var_names = [f'x{j+1}' for j in range(n)]
    blocks = [A.copy()]
    art_cols = []

    for i, s in enumerate(ineq_sense):
        if s == '<=':
            col = np.zeros((m, 1)); col[i, 0] = 1
            blocks.append(col)
            var_names.append(f's{i+1}')
        elif s == '>=':
            col_sur = np.zeros((m, 1)); col_sur[i, 0] = -1
            col_art = np.zeros((m, 1)); col_art[i, 0] = 1
            blocks.append(col_sur); var_names.append(f's{i+1}_sur')
            blocks.append(col_art); var_names.append(f'a{i+1}')
            art_cols.append(len(var_names) - 1)
        else:
            raise ValueError("ineq_sense must be '<=' or '>='")

    A_ext = np.hstack(blocks)
    total_vars = A_ext.shape[1]
    tableau = np.zeros((m + 1, total_vars + 1))
    tableau[:m, :total_vars] = A_ext
    tableau[:m, -1] = b

    tableau[-1, :n] = -c_minimize
    M = 1e6
    for j in art_cols:
        tableau[-1, j] = -M

    basic_vars = []
    for i in range(m):
        for j in range(n, total_vars):
            col = tableau[:m, j]
            if np.allclose(col, np.eye(m)[:, i]):
                basic_vars.append(j)
                break
        else:
            if art_cols:
                basic_vars.append(art_cols.pop(0))
            else:
                raise RuntimeError(f'Не знайдено базис для обмеження {i+1}')

    for bi in basic_vars:
        name = var_names[bi]
        if name.startswith("a"):
            row_idx = np.where(np.isclose(A_ext[:, bi], 1))[0]
            if len(row_idx) > 0:
                tableau[-1, :] -= (-M) * tableau[row_idx[0], :]

    return tableau, basic_vars, var_names, M


def simplex_M_solve(A, b, c_minimize, ineq_sense, max_iters=300):
    try:
        tableau, basic_vars, var_names, M = build_tableau_M(A, b, c_minimize, ineq_sense)
    except Exception:
        return 'build_error', None, None

    it = 0
    while it < max_iters:
        it += 1
        entering = find_entering_var(tableau)
        if entering is None:
            break
        leaving = find_leaving_var(tableau, entering)
        if leaving is None:
            return 'unbounded', None, None
        if leaving >= len(basic_vars):
            return 'index_error', None, None

        basic_vars[leaving] = entering
        try:
            pivot_step(tableau, leaving, entering)
        except ZeroDivisionError:
            return 'pivot_error', None, None

    n_orig = len(c_minimize)
    x = np.zeros(n_orig)
    for i, bi in enumerate(basic_vars):
        if bi < n_orig:
            x[bi] = tableau[i, -1]

    infeasible = False
    for j, name in enumerate(var_names):
        if name.startswith('a') and j in basic_vars:
            val = tableau[basic_vars.index(j), -1]
            if val > 1e-6:
                infeasible = True
                break

    if infeasible:
        return 'infeasible', None, None

    Z = np.dot(c_minimize, x)
    return 'optimal', x, Z


def build_products_from_queryset(qs):
    products = []
    for d in qs:
        if hasattr(d, 'protein'):
            title = d.title
            protein = float(d.protein or 0)
            fat = float(d.fat or 0)
            carbs = float(d.carbs or 0)
            calories = float(d.calories or 0)
            price = float(d.price or 0)
        else:
            title = d.get('title')
            protein = float(d.get('protein', 0))
            fat = float(d.get('fat', 0))
            carbs = float(d.get('carbs', 0))
            calories = float(d.get('calories', 0))
            price = float(d.get('price', 0))
        products.append((title, protein, fat, carbs, calories, price))
    return products


def optimize_meal(products, Pmin, Fmin, Hmin, Emax):
    product_list = build_products_from_queryset(products)
    if len(product_list) == 0:
        return {'status': 'empty_products', 'items': [], 'totals': {}}

    proteins = np.array([p[1] / 100.0 for p in product_list])
    fats = np.array([p[2] / 100.0 for p in product_list])
    carbs = np.array([p[3] / 100.0 for p in product_list])
    kcals = np.array([p[4] / 100.0 for p in product_list])
    costs = np.array([p[5] / 100.0 for p in product_list])

    A = np.vstack([proteins, fats, carbs, kcals])
    b = np.array([Pmin, Fmin, Hmin, Emax], dtype=float)
    sense = ['>=', '>=', '>=', '<=']

    status, x, Z = simplex_M_solve(A, b, costs, sense)

    if status != 'optimal':
        return {'status': status, 'items': [], 'totals': {}}

    items = []
    total_prot = total_fat = total_carbs = total_cal = total_price = 0.0

    for j, qty in enumerate(x):
        if qty > 1e-6:
            title = product_list[j][0]
            grams = float(qty)
            cost = float(costs[j] * grams)
            prot = proteins[j] * grams
            fat = fats[j] * grams
            carb = carbs[j] * grams
            kcal = kcals[j] * grams

            items.append({
                'name': title,
                'grams': round(grams, 2),
                'cost': round(cost, 2),
                'protein': round(prot, 2),
                'fat': round(fat, 2),
                'carbs': round(carb, 2),
                'calories': round(kcal, 2),
            })

            total_prot += prot
            total_fat += fat
            total_carbs += carb
            total_cal += kcal
            total_price += cost

    totals = {
        'protein': round(total_prot, 2),
        'fat': round(total_fat, 2),
        'carbs': round(total_carbs, 2),
        'calories': round(total_cal, 2),
        'price': round(total_price, 2)
    }

    return {'status': 'optimal', 'items': items, 'totals': totals}
