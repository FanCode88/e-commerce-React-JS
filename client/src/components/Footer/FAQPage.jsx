import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import "./Footer.css";

const faqData = [
  {
    category: "Comenzi și Livrare",
    items: [
      {
        question: "Cum se face livrarea și în cât timp ajunge comanda?",
        answer:
          "Livrăm în toată țara prin curier rapid. Timpul estimat de livrare este de 24-48 de ore lucrătoare de la confirmarea comenzii. Pentru comenzile plasate în weekend sau în zilele de sărbătoare legală, expedierea se face în prima zi lucrătoare.",
      },
      {
        question: "Care sunt costurile de transport?",
        answer:
          "Costul standard al transportului este afișat în coșul de cumpărături înainte de finalizarea comenzii. Oferim transport gratuit pentru toate comenzile care depășesc valoarea de 299 RON.",
      },
      {
        question: "Pot urmări stadiul coletului meu?",
        answer:
          "Da. În momentul în care coletul pleacă din depozit, vei primi un email și un SMS de la firmă de curierat cu numărul de AWB și link-ul pentru tracking în timp real.",
      },
    ],
  },
  {
    category: "Mărimi și Potrivire",
    items: [
      {
        question: "Cum aleg mărimea corectă la adidași?",
        answer:
          "Fiecare model de adidași poate avea calapod diferit (unele modele fit mai mic sau mai mare). Îți recomandăm să consulți ghidul de mărimi disponibil pe pagina fiecărui produs sau să măsori lungimea tălpii interioare (în cm) a unei perechi care ți se potrivește deja.",
      },
      {
        question: "Ce fac dacă mărimea comandată nu mi se potrivește?",
        answer: "Nicio problemă! Poți solicita foarte simplu un schimb de mărime sau returul produsului în termen de 14 zile calendaristice de la primire.",
      },
    ],
  },
  {
    category: "Retururi și Garanție",
    items: [
      {
        question: "Care este procedura pentru retur?",
        answer:
          "Ai la dispoziție 14 zile calendaristice de la primirea coletului pentru a returna produsul. Acesta trebuie să fie în starea lui originală, nefolosit, în cutia originală, cu toate etichetele atașate. Contactează-ne sau inițiază returul din contul tău pentru a trimite curierul să ridice coletul.",
      },
      {
        question: "În cât timp primesc banii înapoi în caz de retur?",
        answer:
          "După ce coletul ajunge înapoi la noi și este verificat de echipa de control al calității, contravaloarea produsului va fi virată în contul tău bancar în termen de 3-5 zile lucrătoare.",
      },
      {
        question: "Produsele beneficiază de garanție?",
        answer:
          "Da, toate produsele comercializate pe site beneficiază de garanție conform legislației în vigoare pentru defecte de fabricație sau de material.",
      },
    ],
  },
  {
    category: "Produse și Autenticitate",
    items: [
      {
        question: "Sunt toți adidașii 100% originali?",
        answer:
          "Absolut. Colaborăm exclusiv cu distribuitori autorizați și parteneri de încredere. Toate produsele din magazinul nostru sunt 100% originale, noi și vin în cutiile lor originale.",
      },
      {
        question: "Cum trebuie să întrețin adidașii?",
        answer:
          "Pentru a menține adidașii în cea mai bună formă, îți recomandăm să folosești spray-uri protectoare împotriva umidității și murdăriei înainte de prima purtare. Evită spălarea lor în mașina de spălat rufe; curăță-i manual folosind soluții dedicate și o perie moale.",
      },
    ],
  },
];

const FAQPage = () => {
  const [activeIndices, setActiveIndices] = useState({});

  const toggleFAQ = (catIndex, itemIndex) => {
    const key = `${catIndex}-${itemIndex}`;
    setActiveIndices((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="faq-page-container">
      <div className="faq-header">
        <h1>ÎNTREBĂRI FRECVENTE</h1>
        <div className="title-line"></div>
        <p>Tot ce trebuie să știi despre comenzi, mărimi, livrare și colecțiile noastre de adidași.</p>
      </div>

      <div className="faq-sections-wrapper">
        {faqData.map((category, catIndex) => (
          <div key={catIndex} className="faq-category-block">
            <h2 className="faq-category-title">{category.category}</h2>
            <div className="faq-list">
              {category.items.map((item, itemIndex) => {
                const isOpen = !!activeIndices[`${catIndex}-${itemIndex}`];
                return (
                  <div key={itemIndex} className={`faq-item ${isOpen ? "active" : ""}`} onClick={() => toggleFAQ(catIndex, itemIndex)}>
                    <div className="faq-question">
                      <h3>{item.question}</h3>
                      <FaChevronDown className="faq-icon" />
                    </div>
                    <div className="faq-answer-wrapper">
                      <p className="faq-answer">{item.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
