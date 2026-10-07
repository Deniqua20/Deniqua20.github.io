"use strict";
const toggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
if (toggle && navigation) {
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(expanded));
    navigation.classList.toggle("is-open", expanded);
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      toggle.getAttribute("aria-expanded") === "true"
    ) {
      toggle.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
      toggle.focus();
    }
  });
}
const question = document.querySelector("#quiz-question");
if (question) {
  const questions = [
    {
      term: "SIEM",
      choices: [
        "Security Information and Event Management",
        "System Integrity and Endpoint Monitoring",
        "Secure Internet Encryption Method",
      ],
      answer: 0,
      explanation:
        "SIEM brings security logs together to help teams monitor and investigate events.",
    },
    {
      term: "KQL",
      choices: [
        "Key Quality Layer",
        "Kusto Query Language",
        "Kernel Query Log",
      ],
      answer: 1,
      explanation:
        "Kusto Query Language is used to explore and analyze data in services such as Log Analytics.",
    },
    {
      term: "MFA",
      choices: [
        "Managed Firewall Access",
        "Mainframe Authentication",
        "Multi-Factor Authentication",
      ],
      answer: 2,
      explanation:
        "MFA asks for more than one type of proof of identity, such as a password and an authenticator code.",
    },
    {
      term: "IAM",
      choices: [
        "Identity and Access Management",
        "Internet Activity Monitoring",
        "Incident Analysis Method",
      ],
      answer: 0,
      explanation:
        "IAM helps manage identities and control access to systems and resources.",
    },
  ];
  let current = 0;
  let score = 0;
  let answered = false;
  const options = document.querySelector("#quiz-options");
  const feedback = document.querySelector("#quiz-feedback");
  const next = document.querySelector("#quiz-next");
  function render() {
    answered = false;
    next.hidden = true;
    feedback.textContent = "";
    document.querySelector("#quiz-progress").textContent =
      `Question ${current + 1} of ${questions.length}`;
    question.textContent = `What does ${questions[current].term} stand for?`;
    options.replaceChildren();
    questions[current].choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = choice;
      button.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const correct = index === questions[current].answer;
        if (correct) score++;
        [...options.children].forEach((item, i) => {
          item.disabled = true;
          if (i === questions[current].answer) item.classList.add("correct");
          else if (i === index) item.classList.add("incorrect");
        });
        feedback.textContent = `${correct ? "Correct!" : "Not quite."} ${questions[current].explanation}`;
        next.hidden = false;
        next.textContent =
          current === questions.length - 1
            ? "See results ⟶"
            : "Next question ⟶";
        next.focus();
      });
      options.append(button);
    });
  }
  next.addEventListener("click", () => {
    if (current === questions.length) {
      current = 0;
      score = 0;
      render();
      options.firstChild.focus();
      return;
    }
    if (++current < questions.length) {
      render();
      options.firstChild.focus();
    } else {
      document.querySelector("#quiz-progress").textContent = "Round complete";
      question.textContent = `You got ${score} of ${questions.length} right.`;
      options.replaceChildren();
      feedback.textContent =
        "Every new term is another step forward. Keep learning!";
      next.textContent = "Play again ⟶";
      next.hidden = false;
      next.focus();
    }
  });
  render();
}
