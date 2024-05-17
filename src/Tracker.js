import Storage from './Storage';

class CalorieTracker {
    constructor() {
        this._calorieLimit = Storage.getCalorieLimit();
        this._totalCalories = Storage.getTotalCalories(0);
        this._meals = Storage.getMeals();
        this._workouts = Storage.getWorkouts();

        this._displayCaloriesTotal();
        this._displayCaloriesLimit();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();

        document.getElementById('limit').value = this._calorieLimit;
    }

    // public methods

    addMeal(meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        Storage.updateTotalCalories(this._totalCalories);
        Storage.saveMeal(meal);
        this._displayNewMeal(meal);
        this._render();
    }

    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        Storage.updateTotalCalories(this._totalCalories);
        Storage.saveWorkout(workout);
        this._displayNewWorkout(workout);
        this._render();
    }

    removeMeal(id) {
        const index = this._meals.findIndex((meal) => meal.id === id);

        if (index !== -1) {
            const meal = this._meals[index];
            this._totalCalories -= meal.calories;
            Storage.updateTotalCalories(this._totalCalories);
            this._meals.splice(index, 1);
            Storage.removeMeal(id);
            this._render();
        }
    }

    removeWorkout(id) {
        const index = this._workouts.findIndex((workout) => workout.id === id);

        if (index !== -1) {
            const workout = this._workouts[index];
            this._totalCalories += workout.calories;
            Storage.updateTotalCalories(this._totalCalories);
            this._workouts.splice(index, 1);
            Storage.removeWorkout(id);
            this._render();
        }
    }

    reset() {
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];
        Storage.clearAll();
        this._render();
    }

    setLimit(calorieLimit) {
        this._calorieLimit = calorieLimit;
        Storage.setCalorieLimit(calorieLimit);
        this._displayCaloriesLimit();
        this._render();
    }

    loadItems() {
        this._meals.forEach(meal => this._displayNewMeal(meal));
        this._workouts.forEach(workout => this._displayNewWorkout(workout));
    }

    // private methods

    _displayCaloriesTotal() {
        const totalCaloriesElement = document.getElementById('calories-total');
        totalCaloriesElement.innerHTML = this._totalCalories;
    }

    _displayCaloriesLimit() {
        const limitCaloriesElement = document.getElementById('calories-limit');
        limitCaloriesElement.innerHTML = this._calorieLimit;
    }

    _displayCaloriesConsumed() {
        const consumedCaloriesElement = document.getElementById('calories-consumed');

        const consumed = this._meals.reduce((total, meal) => total + meal.calories, 0)

        consumedCaloriesElement.innerHTML = consumed;
    }

    _displayCaloriesBurned() {
        const burnedCaloriesElement = document.getElementById('calories-burned');

        const burned = this._workouts.reduce((total, workout) => total + workout.calories, 0);

        burnedCaloriesElement.innerHTML = burned;
    }

    _displayCaloriesRemaining() {
        const remainingCaloriesElement = document.getElementById('calories-remaining');

        const remaining = this._calorieLimit - this._totalCalories;
        remainingCaloriesElement.innerHTML = remaining;

        const remainingCard = document.querySelector('.bg-dark');
        const progressElement = document.getElementById('calorie-progress');
        if (remaining <= 0) {
            remainingCaloriesElement.parentElement.parentElement.classList.remove('bg-light');
            remainingCaloriesElement.parentElement.parentElement.classList.add('bg-danger');
            progressElement.classList.remove('bg-success');
            progressElement.classList.add('bg-danger');
        } else {
            remainingCaloriesElement.parentElement.parentElement.classList.remove('bg-danger');
            remainingCaloriesElement.parentElement.parentElement.classList.add('bg-light');
            progressElement.classList.add('bg-success');
            progressElement.classList.remove('bg-danger');
        }

    }

    _displayCaloriesProgress() {
        const progressElement = document.getElementById('calorie-progress');

        const percent = (this._totalCalories / this._calorieLimit) * 100;
        const width = Math.min(percent, 100);
        progressElement.style.width = `${width}%`;


    }

    _displayNewMeal(meal) {
        const mealsElement = document.getElementById('meal-items');
        const mealElement = document.createElement('div');
        mealElement.classList.add('card', 'my-2');
        mealElement.setAttribute('data-id', meal.id);
        mealElement.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                    <h4 class="mx-1">${meal.name}</h4>
                    <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                    >
                    ${meal.calories}
                    </div>
                    <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
        `;

        mealsElement.appendChild(mealElement);
    }

    _displayNewWorkout(workout) {
        const workoutsElement = document.getElementById('workout-items');
        const workoutElement = document.createElement('div');
        workoutElement.classList.add('card', 'my-2');
        workoutElement.setAttribute('data-id', workout.id);
        workoutElement.innerHTML =
        `  <div class="card-body">
            <div class="d-flex align-items-center justify-content-between">
                <h4 class="mx-1">${workout.name}</h4>
                <div
                class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                >
                ${workout.calories}
                </div>
                <button class="delete btn btn-danger btn-sm mx-2">
                <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            </div>`;

        workoutsElement.appendChild(workoutElement);
    }


    _render() {
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }
}

export default CalorieTracker;