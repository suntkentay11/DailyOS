
// --> SKIP THIS PART *** //

// 1. When the page loads, set up everything
document.addEventListener("DOMContentLoaded", function () {
  updateDate();
});

// 2. Set up click events
function setupEventListeners() {
  addButton.addEventListener("click", openAddModal);
  closeButton.addEventListener("click", closeModal);
  saveButton.addEventListener("click", saveItem);

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });
}

// 3. Update the date in the header
function updateDate() {
  const now = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = days[now.getDay()];

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  document.getElementById("currentDay").textContent = dayName;
  document.getElementById("currentDate").textContent = formattedDate;
}

// *********  The above code was covered in the first project ********* //



/* =====================
    JavaScript PART 1 - Kat
    ===================== */




// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Get references to all necessary HTML elements by their IDs
    const calculateBtn = document.getElementById('calculate-btn');
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const ageInput = document.getElementById('age');
    const activityLevelSelect = document.getElementById('activity-level');

    const maintenanceCaloriesSpan = document.getElementById('maintenance-calories');
    const proteinGramsSpan = document.getElementById('protein-grams');
    const carbsGramsSpan = document.getElementById('carbs-grams');
    const fatsGramsSpan = document.getElementById('fats-grams');

    // Add an event listener to the calculate button
    calculateBtn.addEventListener('click', calculateMacros);

    /**
     * Calculates the suggested macros based on user input.
     * This function retrieves values, performs calculations, and displays results.
     */
    function calculateMacros() {
        // Parse input values as floating-point numbers
        const weight = parseFloat(weightInput.value); // Weight in kilograms (kg)
        const height = parseFloat(heightInput.value); // Height in centimeters (cm)
        const age = parseFloat(ageInput.value);       // Age in years
        const activityLevel = parseFloat(activityLevelSelect.value); // Activity multiplier

        // Basic validation: Check if inputs are valid numbers
        if (isNaN(weight) || isNaN(height) || isNaN(age) || weight <= 0 || height <= 0 || age <= 0) {
            // Use a custom message box instead of alert() for better UX
            displayMessage('Please enter valid positive numbers for weight, height, and age.');
            // Clear previous results if inputs are invalid
            maintenanceCaloriesSpan.textContent = '';
            proteinGramsSpan.textContent = '';
            carbsGramsSpan.textContent = '';
            fatsGramsSpan.textContent = '';
            return; // Stop the function if validation fails
        }


        // Mifflin-St Jeor Equation for Basal Metabolic Rate (BMR)
        // This formula is a common standard. For simplicity, we are using the male formula.
        let bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;

        // Calculate Total Daily Energy Expenditure (TDEE), also known as Maintenance Calories
        // TDEE = BMR × Activity Level Factor
        const maintenanceCalories = bmr * activityLevel;

        // Macro Calculations based on common percentages of total calories:
        // Protein: ~30% of total calories
        // Carbohydrates: ~40% of total calories
        // Fats: ~30% of total calories
        const proteinCalories = maintenanceCalories * 0.30;
        const carbsCalories = maintenanceCalories * 0.40;
        const fatsCalories = maintenanceCalories * 0.30;

        // Convert calories to grams using standard caloric values per gram:
        // Protein: 4 calories per gram
        // Carbohydrates: 4 calories per gram
        // Fats: 9 calories per gram
        const proteinGrams = proteinCalories / 4;
        const carbsGrams = carbsCalories / 4;
        const fatsGrams = fatsCalories / 9;

        // Display the calculated results in the respective span elements
        // .toFixed(0) rounds the number to a whole integer
        maintenanceCaloriesSpan.textContent = maintenanceCalories.toFixed(0);
        proteinGramsSpan.textContent = proteinGrams.toFixed(0);
        carbsGramsSpan.textContent = carbsGrams.toFixed(0);
        fatsGramsSpan.textContent = fatsGrams.toFixed(0);
    }

});
