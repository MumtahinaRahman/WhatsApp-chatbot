// Define the options hierarchy using objects
export const options = {
    ShowCategories: {
        Electronics: {
        subSubOption1: "Action 1",
        subSubOption2: "Action 2",
      },
        Clothing: {
        subSubOption3: "Action 3",
        subSubOption4: "Action 4",
      },
        Food: {
            subSubOption5: "Action 5"
        }
    },
    RetrunPolicy: {
      subOption3: {
        subSubOption5: "Action 5",
        subSubOption6: "Action 6",
      }
    },
    TalkToAnAgent: {
      subOption5: {
        subSubOption9: "Action 9",
        subSubOption10: "Action 10",
      }
    },
  };
  
  // Example usage
  console.log(options.option1.subOption1.subSubOption1); // Output: Action 1
  console.log(options.option2.subOption4.subSubOption7); // Output: Action 7
  