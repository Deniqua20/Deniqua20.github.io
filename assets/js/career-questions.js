"use strict";
const CAREER_QUESTIONS = [
  {
    "id": "0",
    "prompt": "The part I would happily spend more time on…",
    "choices": [
      {
        "text": "Listening to someone and helping them feel supported.",
        "weights": {
          "people": 2,
          "explain": 1
        }
      },
      {
        "text": "Following a clue until I understand what happened.",
        "weights": {
          "investigate": 2,
          "organize": 1
        }
      },
      {
        "text": "Reading the instructions and turning them into a clear plan.",
        "weights": {
          "organize": 2,
          "explain": 1
        }
      },
      {
        "text": "Trying things out until I make something work.",
        "weights": {
          "build": 2,
          "investigate": 1
        }
      },
      {
        "text": "Imagining a fresh way something could look or feel.",
        "weights": {
          "create": 2,
          "people": 1
        }
      },
      {
        "text": "Making a complicated idea easy for someone to understand.",
        "weights": {
          "explain": 2,
          "organize": 1
        }
      }
    ]
  },
  {
    "id": "1",
    "prompt": "When something goes wrong, I want to…",
    "choices": [
      {
        "text": "Talk with the person affected and understand what they need.",
        "weights": {
          "people": 2,
          "investigate": 1
        }
      },
      {
        "text": "Look through the details to find the underlying cause.",
        "weights": {
          "investigate": 2,
          "build": 1
        }
      },
      {
        "text": "Check the guidance and work through a reliable process.",
        "weights": {
          "organize": 2,
          "investigate": 1
        }
      },
      {
        "text": "Test a few possible fixes and see what changes.",
        "weights": {
          "build": 2,
          "investigate": 1
        }
      },
      {
        "text": "Rethink the experience so the problem is less likely to happen.",
        "weights": {
          "create": 2,
          "build": 1
        }
      },
      {
        "text": "Explain what happened and give people a clear next step.",
        "weights": {
          "explain": 2,
          "people": 1
        }
      }
    ]
  },
  {
    "id": "2",
    "prompt": "A satisfying afternoon would be…",
    "choices": [
      {
        "text": "Having useful conversations with customers or teammates.",
        "weights": {
          "people": 2,
          "explain": 1
        }
      },
      {
        "text": "Researching a question and checking whether the evidence agrees.",
        "weights": {
          "investigate": 2,
          "organize": 1
        }
      },
      {
        "text": "Reading detailed material and sorting it into something useful.",
        "weights": {
          "organize": 2,
          "investigate": 1
        }
      },
      {
        "text": "Putting together a small tool or working prototype.",
        "weights": {
          "build": 2,
          "create": 1
        }
      },
      {
        "text": "Sketching ideas and experimenting with a different approach.",
        "weights": {
          "create": 2,
          "build": 1
        }
      },
      {
        "text": "Writing a guide or showing someone how something works.",
        "weights": {
          "explain": 2,
          "people": 1
        }
      }
    ]
  },
  {
    "id": "3",
    "prompt": "If I joined a new project, I would enjoy…",
    "choices": [
      {
        "text": "Learning what the people involved actually need.",
        "weights": {
          "people": 2,
          "investigate": 1
        }
      },
      {
        "text": "Finding the unanswered questions and exploring them.",
        "weights": {
          "investigate": 2,
          "create": 1
        }
      },
      {
        "text": "Making the requirements, responsibilities, and next steps clear.",
        "weights": {
          "organize": 2,
          "people": 1
        }
      },
      {
        "text": "Turning an idea into something people can use.",
        "weights": {
          "build": 2,
          "create": 1
        }
      },
      {
        "text": "Designing an experience that feels thoughtful and intuitive.",
        "weights": {
          "create": 2,
          "people": 1
        }
      },
      {
        "text": "Keeping everyone informed with a clear explanation of the plan.",
        "weights": {
          "explain": 2,
          "organize": 1
        }
      }
    ]
  },
  {
    "id": "4",
    "prompt": "The kind of information I naturally notice is…",
    "choices": [
      {
        "text": "What someone is asking for, and what they may not have said yet.",
        "weights": {
          "people": 2,
          "investigate": 1
        }
      },
      {
        "text": "A pattern, inconsistency, or detail that deserves a closer look.",
        "weights": {
          "investigate": 2,
          "organize": 1
        }
      },
      {
        "text": "A missing instruction, unclear requirement, or step out of order.",
        "weights": {
          "organize": 2,
          "explain": 1
        }
      },
      {
        "text": "How the different parts connect and whether they work together.",
        "weights": {
          "build": 2,
          "investigate": 1
        }
      },
      {
        "text": "An opportunity to make something easier or more engaging.",
        "weights": {
          "create": 2,
          "people": 1
        }
      },
      {
        "text": "Where an explanation loses people or needs a better example.",
        "weights": {
          "explain": 2,
          "people": 1
        }
      }
    ]
  },
  {
    "id": "5",
    "prompt": "The challenge I would choose for myself is…",
    "choices": [
      {
        "text": "Helping someone who is frustrated leave feeling confident.",
        "weights": {
          "people": 2,
          "explain": 1
        }
      },
      {
        "text": "Investigating a mystery with incomplete information.",
        "weights": {
          "investigate": 2,
          "organize": 1
        }
      },
      {
        "text": "Making sense of a long document and applying it carefully.",
        "weights": {
          "organize": 2,
          "investigate": 1
        }
      },
      {
        "text": "Building something and improving it through trial and error.",
        "weights": {
          "build": 2,
          "create": 1
        }
      },
      {
        "text": "Finding an original solution when the usual approach feels wrong.",
        "weights": {
          "create": 2,
          "investigate": 1
        }
      },
      {
        "text": "Teaching a topic so someone can use it on their own.",
        "weights": {
          "explain": 2,
          "people": 1
        }
      }
    ]
  },
  {
    "id": "6",
    "prompt": "The finished work I would feel proud to share is…",
    "choices": [
      {
        "text": "A person’s problem resolved and a relationship strengthened.",
        "weights": {
          "people": 2,
          "explain": 1
        }
      },
      {
        "text": "A finding supported by evidence, with the limits made clear.",
        "weights": {
          "investigate": 2,
          "organize": 1
        }
      },
      {
        "text": "A dependable process that others can follow and check.",
        "weights": {
          "organize": 2,
          "explain": 1
        }
      },
      {
        "text": "Something functional that solves a practical problem.",
        "weights": {
          "build": 2,
          "organize": 1
        }
      },
      {
        "text": "A thoughtful design that makes an experience better.",
        "weights": {
          "create": 2,
          "people": 1
        }
      },
      {
        "text": "A useful explanation that makes a difficult subject click.",
        "weights": {
          "explain": 2,
          "create": 1
        }
      }
    ]
  },
  {
    "id": "7",
    "prompt": "If I could choose what to do more often, I would choose…",
    "choices": [
      {
        "text": "Listening, asking questions, and working directly with people.",
        "weights": {
          "people": 2,
          "explain": 1
        }
      },
      {
        "text": "Researching, comparing evidence, and finding explanations.",
        "weights": {
          "investigate": 2,
          "organize": 1
        }
      },
      {
        "text": "Reading documentation, organizing details, and improving processes.",
        "weights": {
          "organize": 2,
          "investigate": 1
        }
      },
      {
        "text": "Making, fixing, and connecting things that need to work.",
        "weights": {
          "build": 2,
          "investigate": 1
        }
      },
      {
        "text": "Creating, experimenting, and improving how something feels to use.",
        "weights": {
          "create": 2,
          "build": 1
        }
      },
      {
        "text": "Writing, teaching, and making information easier to understand.",
        "weights": {
          "explain": 2,
          "people": 1
        }
      }
    ]
  }
];
if (typeof module !== "undefined" && module.exports) module.exports = CAREER_QUESTIONS;
