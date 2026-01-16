import React from "react";
import styles from "./ContactSection.module.css";
import Button from "../Button/Button";

import { ReactComponent as ChevronIcon } from "../../assets/chevron-right.svg";

function ContactSection() {
  return (
    <section className={styles.contactSection}>
      <div className={styles.content}>
        <h2>Зв'яжіться з нами</h2>

        <p>
          Маєте запитання, відгуки чи пропозиції? Ми будемо раді вас почути!
        </p>

        <Button variant="secondary" iconAfter={<ChevronIcon />}>
          Написати нам
        </Button>
      </div>
    </section>
  );
}

export default ContactSection;
