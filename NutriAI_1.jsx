import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import {
  Flame, Dumbbell, Search, X, RotateCcw, Download, Moon, Sun,
  ChevronRight, ChevronDown, Plus, Check, Activity, Ruler, Scale,
  Salad, Beef, Wheat, Droplet, Leaf
} from "lucide-react";

/* ============================================================
   DATA — sample food nutrition dataset (per 100g)
   Replace/extend this array with your uploaded dataset later.
   ============================================================ */
const FOODS = [
  { name: "Chicken Breast (grilled)", diet: "nonveg", group: "protein", cal: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
  { name: "Egg (whole, boiled)", diet: "nonveg", group: "protein", cal: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
  { name: "Egg Whites", diet: "nonveg", group: "protein", cal: 52, protein: 11, carbs: 0.7, fat: 0.2, fiber: 0 },
  { name: "Salmon (grilled)", diet: "nonveg", group: "protein", cal: 208, protein: 20, carbs: 0, fat: 13, fiber: 0 },
  { name: "Tuna (canned, in water)", diet: "nonveg", group: "protein", cal: 116, protein: 26, carbs: 0, fat: 1, fiber: 0 },
  { name: "Turkey Breast", diet: "nonveg", group: "protein", cal: 135, protein: 30, carbs: 0, fat: 1, fiber: 0 },
  { name: "Lean Beef Mince", diet: "nonveg", group: "protein", cal: 217, protein: 26, carbs: 0, fat: 12, fiber: 0 },
  { name: "Prawns", diet: "nonveg", group: "protein", cal: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0 },
  { name: "Paneer (cottage cheese)", diet: "veg", group: "protein", cal: 265, protein: 18, carbs: 6, fat: 20, fiber: 0 },
  { name: "Tofu (firm)", diet: "veg", group: "protein", cal: 144, protein: 15, carbs: 3, fat: 9, fiber: 2 },
  { name: "Chickpeas (boiled)", diet: "veg", group: "protein", cal: 164, protein: 9, carbs: 27, fat: 2.6, fiber: 8 },
  { name: "Kidney Beans (rajma, boiled)", diet: "veg", group: "protein", cal: 127, protein: 9, carbs: 23, fat: 0.5, fiber: 7 },
  { name: "Lentils / Dal (cooked)", diet: "veg", group: "protein", cal: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8 },
  { name: "Greek Yogurt (plain)", diet: "veg", group: "protein", cal: 97, protein: 9, carbs: 3.6, fat: 5, fiber: 0 },
  { name: "Whey Protein (scoop, mixed)", diet: "veg", group: "protein", cal: 120, protein: 24, carbs: 3, fat: 1.5, fiber: 0 },
  { name: "Soybean Chunks (cooked)", diet: "veg", group: "protein", cal: 173, protein: 17, carbs: 12, fat: 8, fiber: 6 },
  { name: "Cottage Cheese (low fat)", diet: "veg", group: "protein", cal: 98, protein: 11, carbs: 3.4, fat: 4.3, fiber: 0 },

  { name: "Brown Rice (cooked)", diet: "veg", group: "carb", cal: 123, protein: 2.7, carbs: 26, fat: 1, fiber: 1.8 },
  { name: "White Rice (cooked)", diet: "veg", group: "carb", cal: 130, protein: 2.4, carbs: 28, fat: 0.3, fiber: 0.4 },
  { name: "Rolled Oats (dry)", diet: "veg", group: "carb", cal: 389, protein: 17, carbs: 66, fat: 7, fiber: 10 },
  { name: "Whole Wheat Roti", diet: "veg", group: "carb", cal: 297, protein: 11, carbs: 58, fat: 4, fiber: 10 },
  { name: "Sweet Potato (boiled)", diet: "veg", group: "carb", cal: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3 },
  { name: "Quinoa (cooked)", diet: "veg", group: "carb", cal: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8 },
  { name: "Whole Wheat Bread", diet: "veg", group: "carb", cal: 247, protein: 13, carbs: 41, fat: 3.4, fiber: 7 },
  { name: "Potato (boiled)", diet: "veg", group: "carb", cal: 87, protein: 1.9, carbs: 20, fat: 0.1, fiber: 1.8 },
  { name: "Banana", diet: "veg", group: "fruit", cal: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6 },
  { name: "Apple", diet: "veg", group: "fruit", cal: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 },
  { name: "Papaya", diet: "veg", group: "fruit", cal: 43, protein: 0.5, carbs: 11, fat: 0.3, fiber: 1.7 },
  { name: "Orange", diet: "veg", group: "fruit", cal: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4 },

  { name: "Broccoli (steamed)", diet: "veg", group: "veg", cal: 35, protein: 2.4, carbs: 7, fat: 0.4, fiber: 3.3 },
  { name: "Spinach (cooked)", diet: "veg", group: "veg", cal: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 },
  { name: "Mixed Salad Greens", diet: "veg", group: "veg", cal: 15, protein: 1.4, carbs: 2.9, fat: 0.2, fiber: 1.3 },
  { name: "Cucumber", diet: "veg", group: "veg", cal: 16, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5 },
  { name: "Carrot", diet: "veg", group: "veg", cal: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8 },
  { name: "Cauliflower (steamed)", diet: "veg", group: "veg", cal: 25, protein: 1.9, carbs: 5, fat: 0.3, fiber: 2 },
  { name: "Bell Pepper (mixed colors)", diet: "veg", group: "veg", cal: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1 },
  { name: "Tomato", diet: "veg", group: "veg", cal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },

  { name: "Almonds", diet: "veg", group: "fat", cal: 579, protein: 21, carbs: 22, fat: 50, fiber: 12.5 },
  { name: "Walnuts", diet: "veg", group: "fat", cal: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7 },
  { name: "Peanut Butter (natural)", diet: "veg", group: "fat", cal: 588, protein: 25, carbs: 20, fat: 50, fiber: 6 },
  { name: "Olive Oil", diet: "veg", group: "fat", cal: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 },
  { name: "Avocado", diet: "veg", group: "fat", cal: 160, protein: 2, carbs: 9, fat: 15, fiber: 7 },
  { name: "Chia Seeds", diet: "veg", group: "fat", cal: 486, protein: 17, carbs: 42, fat: 31, fiber: 34 },
  { name: "Flax Seeds", diet: "veg", group: "fat", cal: 534, protein: 18, carbs: 29, fat: 42, fiber: 27 },
  { name: "Peanuts (roasted)", diet: "veg", group: "fat", cal: 567, protein: 26, carbs: 16, fat: 49, fiber: 8 },

  { name: "Low-fat Milk", diet: "veg", group: "dairy", cal: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0 },
  { name: "Whole Milk", diet: "veg", group: "dairy", cal: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0 },
  { name: "Cheddar Cheese", diet: "veg", group: "dairy", cal: 403, protein: 25, carbs: 1.3, fat: 33, fiber: 0 },
];

const FOOD_GROUP_META = {
  protein: { icon: Beef, label: "Protein" },
  carb: { icon: Wheat, label: "Carb" },
  veg: { icon: Salad, label: "Vegetable" },
  fruit: { icon: Leaf, label: "Fruit" },
  fat: { icon: Droplet, label: "Healthy Fat" },
  dairy: { icon: Droplet, label: "Dairy" },
};

const MEAL_LAYOUTS = {
  3: [["Breakfast", 0.30], ["Lunch", 0.40], ["Dinner", 0.30]],
  4: [["Breakfast", 0.25], ["Lunch", 0.35], ["Dinner", 0.25], ["Snacks", 0.15]],
  5: [["Breakfast", 0.20], ["Mid-Morning Snack", 0.10], ["Lunch", 0.30], ["Evening Snack", 0.10], ["Dinner", 0.30]],
  6: [["Breakfast", 0.20], ["Mid-Morning Snack", 0.10], ["Lunch", 0.25], ["Evening Snack", 0.10], ["Dinner", 0.25], ["Post-Workout", 0.10]],
};

const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
};

/* ============================================================
   CALCULATIONS
   ============================================================ */
function calcBMI(weightKg, heightCm) {
  const h = heightCm / 100;
  return weightKg / (h * h);
}

function calcTDEE({ age, gender, weight, height, activity }) {
  const base = gender === "male"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
  return base * ACTIVITY_FACTORS[activity];
}

function calcTargetCalories(tdee, goal, customCalories) {
  if (customCalories) return customCalories;
  if (goal === "cut") return Math.round(tdee * 0.8);
  if (goal === "bulk") return Math.round(tdee * 1.15);
  return Math.round(tdee);
}

function calcMacroTargets(weight, goal, calories) {
  const proteinPerKg = goal === "cut" ? 2.2 : goal === "bulk" ? 1.8 : 1.6;
  const proteinG = Math.round(weight * proteinPerKg);
  const proteinCal = proteinG * 4;
  const fatCal = calories * (goal === "cut" ? 0.30 : 0.27);
  const fatG = Math.round(fatCal / 9);
  const carbCal = Math.max(calories - proteinCal - fatCal, 0);
  const carbG = Math.round(carbCal / 4);
  return { proteinG, fatG, carbG };
}

function dietCategory({ goal, calories, weight, bmi }) {
  // Lightweight rule-based stand-in for the Random Forest classifier
  // (see backend/train_model.py for the real supervised model).
  if (goal === "cut" && bmi >= 25) return "High-Protein Fat Loss";
  if (goal === "cut") return "Lean Cut / Recomposition";
  if (goal === "bulk" && bmi < 22) return "High-Calorie Lean Bulk";
  if (goal === "bulk") return "Controlled Muscle Gain";
  return "Balanced Maintenance";
}

/* ============================================================
   DIET PLANNING ENGINE
   ============================================================ */
function pickWeighted(list, rand) {
  if (list.length === 0) return null;
  return list[Math.floor(rand() * list.length)];
}

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildMealFoods({ mealCalTarget, pool, preferred, seedRand }) {
  // Choose ~3-4 items spanning protein / carb / veg / fat groups
  const groups = ["protein", "carb", "veg", "fat"];
  const chosen = [];
  groups.forEach((g) => {
    let candidates = pool.filter((f) => f.group === g || (g === "carb" && f.group === "fruit"));
    if (candidates.length === 0) return;
    const preferredMatches = candidates.filter((f) => preferred.includes(f.name));
    const source = preferredMatches.length ? preferredMatches : candidates;
    const pick = pickWeighted(source, seedRand);
    if (pick) chosen.push(pick);
  });
  if (chosen.length === 0) return [];

  // initial equal split of meal calorie budget
  let items = chosen.map((f) => ({ ...f, grams: 100, calShare: mealCalTarget / chosen.length }));
  items = items.map((it) => ({ ...it, grams: Math.max(10, Math.round((it.calShare / it.cal) * 100 / 5) * 5) }));

  // scale to hit meal calorie target within tolerance
  for (let i = 0; i < 4; i++) {
    const total = items.reduce((s, it) => s + (it.cal * it.grams) / 100, 0);
    if (total === 0) break;
    const factor = mealCalTarget / total;
    if (Math.abs(factor - 1) < 0.03) break;
    items = items.map((it) => ({ ...it, grams: Math.max(10, Math.round((it.grams * factor) / 5) * 5) }));
  }
  return items;
}

function generatePlan({ mealsPerDay, targetCalories, macros, dietPref, preferredFoods, avoidFoods, seed }) {
  const seedRand = mulberry32(seed);
  const pool = FOODS.filter((f) => {
    if (avoidFoods.includes(f.name)) return false;
    if (dietPref === "veg" && f.diet !== "veg") return false;
    return true;
  });

  const layout = MEAL_LAYOUTS[mealsPerDay] || MEAL_LAYOUTS[4];
  const meals = {};
  layout.forEach(([name, pct]) => {
    const mealCalTarget = targetCalories * pct;
    meals[name] = buildMealFoods({ mealCalTarget, pool, preferred: preferredFoods, seedRand });
  });

  const totals = { cal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  Object.values(meals).forEach((items) => {
    items.forEach((it) => {
      const factor = it.grams / 100;
      totals.cal += it.cal * factor;
      totals.protein += it.protein * factor;
      totals.carbs += it.carbs * factor;
      totals.fat += it.fat * factor;
      totals.fiber += it.fiber * factor;
    });
  });

  return { meals, totals, layout };
}

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */
function Field({ label, children }) {
  return (
    <label className="nai-field">
      <span className="nai-field-label">{label}</span>
      {children}
    </label>
  );
}

function SegButton({ options, value, onChange }) {
  return (
    <div className="nai-seg">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={"nai-seg-btn" + (value === opt.value ? " active" : "")}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function FoodMultiSelect({ label, selected, setSelected, exclude = [] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const results = useMemo(() => {
    if (!query) return [];
    return FOODS.filter(
      (f) =>
        f.name.toLowerCase().includes(query.toLowerCase()) &&
        !selected.includes(f.name)
    ).slice(0, 8);
  }, [query, selected]);

  return (
    <div className="nai-field">
      <span className="nai-field-label">{label}</span>
      <div className="nai-multiselect">
        <div className="nai-chip-row">
          {selected.map((name) => (
            <span key={name} className="nai-chip">
              {name}
              <button type="button" onClick={() => setSelected(selected.filter((n) => n !== name))}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="nai-search-wrap">
          <Search size={15} className="nai-search-icon" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Search foods…"
            className="nai-search-input"
          />
        </div>
        {open && results.length > 0 && (
          <div className="nai-dropdown">
            {results.map((f) => (
              <button
                type="button"
                key={f.name}
                className="nai-dropdown-item"
                onClick={() => {
                  setSelected([...selected, f.name]);
                  setQuery("");
                  setOpen(false);
                }}
              >
                <span>{f.name}</span>
                <span className="nai-dropdown-meta">{f.cal} kcal/100g</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
export default function NutriAI() {
  const [theme, setTheme] = useState("light");
  const [stage, setStage] = useState("hero"); // hero | form | dashboard
  const [seed, setSeed] = useState(42);

  const [inputs, setInputs] = useState({
    age: 26,
    gender: "male",
    height: 175,
    weight: 72,
    goal: "cut",
    activity: "moderate",
    dietPref: "nonveg",
    useCustomCalories: false,
    customCalories: 2200,
    mealsPerDay: 4,
    preferredFoods: [],
    avoidFoods: [],
  });

  const bmi = useMemo(() => calcBMI(inputs.weight, inputs.height), [inputs.weight, inputs.height]);
  const tdee = useMemo(() => calcTDEE(inputs), [inputs.age, inputs.gender, inputs.weight, inputs.height, inputs.activity]);
  const targetCalories = useMemo(
    () => calcTargetCalories(tdee, inputs.goal, inputs.useCustomCalories ? inputs.customCalories : null),
    [tdee, inputs.goal, inputs.useCustomCalories, inputs.customCalories]
  );
  const macroTargets = useMemo(() => calcMacroTargets(inputs.weight, inputs.goal, targetCalories), [inputs.weight, inputs.goal, targetCalories]);
  const category = useMemo(() => dietCategory({ goal: inputs.goal, calories: targetCalories, weight: inputs.weight, bmi }), [inputs.goal, targetCalories, inputs.weight, bmi]);

  const plan = useMemo(() => generatePlan({
    mealsPerDay: inputs.mealsPerDay,
    targetCalories,
    macros: macroTargets,
    dietPref: inputs.dietPref,
    preferredFoods: inputs.preferredFoods,
    avoidFoods: inputs.avoidFoods,
    seed,
  }), [inputs.mealsPerDay, targetCalories, macroTargets, inputs.dietPref, inputs.preferredFoods, inputs.avoidFoods, seed]);

  function update(patch) {
    setInputs((prev) => ({ ...prev, ...patch }));
  }

  function handleGenerate() {
    setSeed(Date.now());
    setStage("dashboard");
  }

  function handleRegenerate() {
    setSeed(Date.now() + Math.floor(Math.random() * 1000));
  }

  function handleExportPDF() {
    window.print();
  }

  return (
    <div className={"nai-root theme-" + theme}>
      <StyleBlock />
      <TopNav theme={theme} setTheme={setTheme} stage={stage} setStage={setStage} />

      {stage === "hero" && <Hero onStart={() => setStage("form")} />}

      {stage === "form" && (
        <PlannerForm
          inputs={inputs}
          update={update}
          bmi={bmi}
          tdee={tdee}
          targetCalories={targetCalories}
          macroTargets={macroTargets}
          onGenerate={handleGenerate}
        />
      )}

      {stage === "dashboard" && (
        <Dashboard
          inputs={inputs}
          bmi={bmi}
          tdee={tdee}
          targetCalories={targetCalories}
          macroTargets={macroTargets}
          category={category}
          plan={plan}
          onRegenerate={handleRegenerate}
          onExportPDF={handleExportPDF}
          onEdit={() => setStage("form")}
        />
      )}

      <footer className="nai-footer">
        <span>NUTRIAI — DAILY FUEL FACTS ENGINE</span>
      </footer>
    </div>
  );
}

/* ============================================================
   TOP NAV / HERO
   ============================================================ */
function TopNav({ theme, setTheme, stage, setStage }) {
  return (
    <header className="nai-nav">
      <button className="nai-logo" onClick={() => setStage("hero")}>
        <Flame size={20} strokeWidth={2.5} />
        <span>NUTRI<b>AI</b></span>
      </button>
      <nav className="nai-nav-links">
        <button className={stage === "form" ? "active" : ""} onClick={() => setStage("form")}>Plan Builder</button>
        <button className={stage === "dashboard" ? "active" : ""} onClick={() => setStage("dashboard")}>Dashboard</button>
      </nav>
      <button className="nai-theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
        {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
      </button>
    </header>
  );
}

function Hero({ onStart }) {
  return (
    <section className="nai-hero">
      <div className="nai-hero-copy">
        <span className="nai-eyebrow">GYM-FOCUSED · DATA-DRIVEN · DAILY</span>
        <h1>Every gym goal<br />has a label.</h1>
        <p>
          Enter your stats and target calories. NutriAI builds a full day of meals
          from real food data — sized, macro-matched, and labeled like the back of
          a package, but personal to you.
        </p>
        <button className="nai-btn-primary" onClick={onStart}>
          Build my plan <ChevronRight size={16} />
        </button>
      </div>
      <div className="nai-hero-label">
        <div className="nai-label-card">
          <div className="nai-label-title">DAILY FUEL FACTS</div>
          <div className="nai-rule-thick" />
          <div className="nai-label-row big">
            <span>Calories</span><span>2,200</span>
          </div>
          <div className="nai-rule-thin" />
          <div className="nai-label-row"><span>Protein</span><span>160 g</span></div>
          <div className="nai-label-row"><span>Carbohydrates</span><span>210 g</span></div>
          <div className="nai-label-row"><span>Fat</span><span>62 g</span></div>
          <div className="nai-label-row"><span>Fiber</span><span>32 g</span></div>
          <div className="nai-rule-thick" />
          <div className="nai-label-foot">% Goal Match calculated per meal, not per bite.</div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PLANNER FORM
   ============================================================ */
function PlannerForm({ inputs, update, bmi, tdee, targetCalories, macroTargets, onGenerate }) {
  return (
    <section className="nai-form-page">
      <div className="nai-form-grid">
        <div className="nai-card">
          <h2><span className="nai-eyebrow">01 — PERSONAL</span>Your details</h2>
          <div className="nai-row-2">
            <Field label="Age">
              <input type="number" value={inputs.age} min={14} max={90}
                onChange={(e) => update({ age: Number(e.target.value) })} />
            </Field>
            <Field label="Gender">
              <SegButton
                value={inputs.gender}
                onChange={(v) => update({ gender: v })}
                options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]}
              />
            </Field>
          </div>
          <div className="nai-row-2">
            <Field label="Height (cm)">
              <input type="number" value={inputs.height} min={120} max={230}
                onChange={(e) => update({ height: Number(e.target.value) })} />
            </Field>
            <Field label="Weight (kg)">
              <input type="number" value={inputs.weight} min={30} max={220}
                onChange={(e) => update({ weight: Number(e.target.value) })} />
            </Field>
          </div>
          <div className="nai-stat-strip">
            <div><Ruler size={14} /> BMI <b>{bmi.toFixed(1)}</b></div>
            <div><Activity size={14} /> TDEE <b>{Math.round(tdee)}</b> kcal</div>
          </div>
        </div>

        <div className="nai-card">
          <h2><span className="nai-eyebrow">02 — GOAL</span>Fitness goal &amp; activity</h2>
          <Field label="Goal">
            <SegButton
              value={inputs.goal}
              onChange={(v) => update({ goal: v })}
              options={[
                { value: "cut", label: "Cut" },
                { value: "maintain", label: "Maintain" },
                { value: "bulk", label: "Bulk" },
              ]}
            />
          </Field>
          <Field label="Activity level">
            <select value={inputs.activity} onChange={(e) => update({ activity: e.target.value })}>
              <option value="sedentary">Sedentary — desk job, little exercise</option>
              <option value="light">Lightly active — 1-3 workouts/week</option>
              <option value="moderate">Moderately active — 3-5 workouts/week</option>
              <option value="very">Very active — 6-7 workouts/week</option>
            </select>
          </Field>
          <Field label="Diet preference">
            <SegButton
              value={inputs.dietPref}
              onChange={(v) => update({ dietPref: v })}
              options={[{ value: "veg", label: "Vegetarian" }, { value: "nonveg", label: "Non-Vegetarian" }]}
            />
          </Field>
        </div>

        <div className="nai-card">
          <h2><span className="nai-eyebrow">03 — CALORIES</span>Target calories</h2>
          <Field label="">
            <label className="nai-checkbox">
              <input type="checkbox" checked={inputs.useCustomCalories}
                onChange={(e) => update({ useCustomCalories: e.target.checked })} />
              Enter my own target instead of auto TDEE calculation
            </label>
          </Field>
          {inputs.useCustomCalories ? (
            <Field label="Custom target calories">
              <input type="number" value={inputs.customCalories} min={1000} max={5000}
                onChange={(e) => update({ customCalories: Number(e.target.value) })} />
            </Field>
          ) : (
            <div className="nai-label-row big" style={{ marginTop: 8 }}>
              <span>Auto-calculated target</span><span>{targetCalories} kcal</span>
            </div>
          )}
          <div className="nai-macro-preview">
            <span>Protein {macroTargets.proteinG}g</span>
            <span>Carbs {macroTargets.carbG}g</span>
            <span>Fat {macroTargets.fatG}g</span>
          </div>
          <Field label="Meals per day">
            <SegButton
              value={inputs.mealsPerDay}
              onChange={(v) => update({ mealsPerDay: v })}
              options={[3, 4, 5, 6].map((n) => ({ value: n, label: String(n) }))}
            />
          </Field>
        </div>

        <div className="nai-card">
          <h2><span className="nai-eyebrow">04 — FOODS</span>Preferences</h2>
          <FoodMultiSelect
            label="Preferred foods (prioritized in your plan)"
            selected={inputs.preferredFoods}
            setSelected={(v) => update({ preferredFoods: v })}
          />
          <FoodMultiSelect
            label="Foods to avoid (excluded entirely)"
            selected={inputs.avoidFoods}
            setSelected={(v) => update({ avoidFoods: v })}
          />
        </div>
      </div>

      <button className="nai-btn-primary nai-generate" onClick={onGenerate}>
        Generate my diet plan <ChevronRight size={16} />
      </button>
    </section>
  );
}

/* ============================================================
   DASHBOARD
   ============================================================ */
const MACRO_COLORS = ["var(--accent-green)", "var(--accent-orange)", "var(--accent-berry)"];

function Dashboard({ inputs, bmi, tdee, targetCalories, macroTargets, category, plan, onRegenerate, onExportPDF, onEdit }) {
  const { totals, meals, layout } = plan;
  const macroData = [
    { name: "Protein", value: Math.round(totals.protein) },
    { name: "Carbs", value: Math.round(totals.carbs) },
    { name: "Fat", value: Math.round(totals.fat) },
  ];
  const calorieByMeal = layout.map(([name]) => ({
    name,
    kcal: Math.round((meals[name] || []).reduce((s, it) => s + (it.cal * it.grams) / 100, 0)),
  }));

  const calMatch = Math.abs(totals.cal - targetCalories) / targetCalories <= 0.05;
  const proteinMatch = Math.abs(totals.protein - macroTargets.proteinG) / Math.max(macroTargets.proteinG, 1) <= 0.10;

  return (
    <section className="nai-dashboard">
      <div className="nai-dash-toolbar no-print">
        <div className="nai-tag">{category}</div>
        <div className="nai-toolbar-actions">
          <button className="nai-btn-ghost" onClick={onEdit}>Edit inputs</button>
          <button className="nai-btn-ghost" onClick={onRegenerate}><RotateCcw size={15} /> Regenerate meals</button>
          <button className="nai-btn-primary small" onClick={onExportPDF}><Download size={15} /> Export as PDF</button>
        </div>
      </div>

      <div className="nai-dash-grid">
        <div className="nai-label-card summary">
          <div className="nai-label-title">DAILY FUEL FACTS</div>
          <div className="nai-rule-thick" />
          <div className="nai-label-row big">
            <span>Calories</span><span>{Math.round(totals.cal)}</span>
          </div>
          <div className="nai-match-row">
            <MatchPill ok={calMatch} label={`Target ${targetCalories} kcal (±5%)`} />
          </div>
          <div className="nai-rule-thin" />
          <div className="nai-label-row"><span>Protein</span><span>{Math.round(totals.protein)} g</span></div>
          <div className="nai-match-row"><MatchPill ok={proteinMatch} label={`Target ${macroTargets.proteinG} g (±10%)`} /></div>
          <div className="nai-label-row"><span>Carbohydrates</span><span>{Math.round(totals.carbs)} g</span></div>
          <div className="nai-label-row"><span>Fat</span><span>{Math.round(totals.fat)} g</span></div>
          <div className="nai-label-row"><span>Fiber</span><span>{Math.round(totals.fiber)} g</span></div>
          <div className="nai-rule-thick" />
          <div className="nai-label-foot">BMI {bmi.toFixed(1)} · TDEE {Math.round(tdee)} kcal · Goal {inputs.goal}</div>
        </div>

        <div className="nai-card chart-card">
          <h3>Macro split</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={macroData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {macroData.map((_, i) => <Cell key={i} fill={MACRO_COLORS[i % MACRO_COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="nai-card chart-card">
          <h3>Calories by meal</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={calorieByMeal}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="kcal" fill="var(--accent-orange)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="nai-meals">
        {layout.map(([name]) => (
          <MealCard key={name} name={name} items={meals[name] || []} />
        ))}
      </div>
    </section>
  );
}

function MatchPill({ ok, label }) {
  return (
    <span className={"nai-pill " + (ok ? "ok" : "warn")}>
      <Check size={12} /> {label}
    </span>
  );
}

function MealCard({ name, items }) {
  const totalCal = items.reduce((s, it) => s + (it.cal * it.grams) / 100, 0);
  return (
    <div className="nai-meal-card">
      <div className="nai-meal-head">
        <h3>{name}</h3>
        <span>{Math.round(totalCal)} kcal</span>
      </div>
      <table className="nai-meal-table">
        <thead>
          <tr>
            <th>Food</th><th>Qty</th><th>Cal</th><th>Protein</th><th>Carbs</th><th>Fat</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.name}>
              <td>{it.name}</td>
              <td>{it.grams} g</td>
              <td>{Math.round((it.cal * it.grams) / 100)}</td>
              <td>{((it.protein * it.grams) / 100).toFixed(1)}g</td>
              <td>{((it.carbs * it.grams) / 100).toFixed(1)}g</td>
              <td>{((it.fat * it.grams) / 100).toFixed(1)}g</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={6} className="nai-empty">No matching foods for this meal — adjust preferences.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ============================================================
   STYLES
   ============================================================ */
function StyleBlock() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Oswald:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

      .nai-root {
        --bg: #FFFFFF;
        --surface: #F6F6F3;
        --ink: #14171A;
        --muted: #62666B;
        --rule: #14171A;
        --accent-orange: #FF5A1F;
        --accent-green: #1F6F4A;
        --accent-berry: #B23A48;
        --card-border: #14171A;
        font-family: 'Oswald', sans-serif;
        color: var(--ink);
        background: var(--bg);
        min-height: 100%;
        width: 100%;
        transition: background .3s, color .3s;
        padding-bottom: 40px;
      }
      .nai-root.theme-dark {
        --bg: #14171A;
        --surface: #1D2124;
        --ink: #F3F3EF;
        --muted: #9CA1A6;
        --rule: #F3F3EF;
        --card-border: #F3F3EF;
      }
      .nai-root * { box-sizing: border-box; }
      .nai-root h1, .nai-root h2, .nai-root h3 { font-family: 'Oswald', sans-serif; margin: 0; letter-spacing: -0.01em; }
      .nai-root input, .nai-root select, .nai-root button { font-family: 'Oswald', sans-serif; }
      .nai-root table { font-family: 'JetBrains Mono', monospace; }

      .nai-eyebrow {
        display: block;
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        letter-spacing: 0.12em;
        color: var(--accent-orange);
        font-weight: 700;
        margin-bottom: 6px;
      }

      /* NAV */
      .nai-nav {
        display: flex; align-items: center; justify-content: space-between;
        padding: 18px 28px; border-bottom: 2px solid var(--rule);
      }
      .nai-logo {
        display: flex; align-items: center; gap: 8px;
        background: none; border: none; cursor: pointer; color: var(--ink);
        font-family: 'Archivo Black', sans-serif; font-size: 18px; letter-spacing: -0.02em;
      }
      .nai-logo b { color: var(--accent-orange); }
      .nai-nav-links { display: flex; gap: 4px; }
      .nai-nav-links button {
        background: none; border: none; cursor: pointer; padding: 8px 14px;
        font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em;
        color: var(--muted); border-radius: 999px;
      }
      .nai-nav-links button.active { background: var(--ink); color: var(--bg); }
      .nai-theme-toggle {
        border: 2px solid var(--rule); background: none; border-radius: 999px;
        width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
        cursor: pointer; color: var(--ink);
      }

      /* HERO */
      .nai-hero {
        display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 48px;
        padding: 64px 28px; align-items: center; max-width: 1180px; margin: 0 auto;
      }
      .nai-hero h1 { font-family: 'Archivo Black', sans-serif; font-size: 52px; line-height: 1.02; letter-spacing: -0.02em; margin-bottom: 20px; }
      .nai-hero p { color: var(--muted); font-size: 16px; line-height: 1.6; max-width: 46ch; margin-bottom: 28px; }
      .nai-btn-primary {
        background: var(--accent-orange); color: #fff; border: none; border-radius: 999px;
        padding: 14px 26px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;
        display: inline-flex; align-items: center; gap: 8px; cursor: pointer; transition: transform .15s;
      }
      .nai-btn-primary:hover { transform: translateY(-2px); }
      .nai-btn-primary.small { padding: 10px 16px; font-size: 12px; }
      .nai-btn-ghost {
        background: none; border: 2px solid var(--rule); color: var(--ink); border-radius: 999px;
        padding: 9px 16px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em;
        display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
      }

      /* NUTRITION LABEL CARD (signature element) */
      .nai-label-card {
        border: 3px solid var(--rule); border-radius: 6px; padding: 18px 20px;
        background: var(--surface); max-width: 340px; margin-left: auto;
      }
      .nai-label-card.summary { max-width: 100%; margin: 0; }
      .nai-label-title { font-family: 'Archivo Black', sans-serif; font-size: 22px; letter-spacing: -0.01em; }
      .nai-rule-thick { height: 8px; background: var(--rule); margin: 8px 0; }
      .nai-rule-thin { height: 1px; background: var(--rule); margin: 6px 0; opacity: 0.5; }
      .nai-label-row { display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 14px; padding: 3px 0; }
      .nai-label-row.big { font-family: 'Archivo Black', sans-serif; font-size: 30px; align-items: baseline; }
      .nai-label-foot { font-size: 11px; color: var(--muted); margin-top: 6px; font-family: 'JetBrains Mono', monospace; }
      .nai-match-row { margin-bottom: 4px; }
      .nai-pill {
        display: inline-flex; align-items: center; gap: 4px; font-size: 10.5px;
        font-family: 'JetBrains Mono', monospace; padding: 2px 8px; border-radius: 999px;
        border: 1px solid var(--rule);
      }
      .nai-pill.ok { color: var(--accent-green); border-color: var(--accent-green); }
      .nai-pill.warn { color: var(--accent-berry); border-color: var(--accent-berry); }

      /* FORM */
      .nai-form-page { max-width: 1180px; margin: 0 auto; padding: 40px 28px 0; }
      .nai-form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
      .nai-card {
        border: 2px solid var(--rule); border-radius: 10px; padding: 22px; background: var(--surface);
      }
      .nai-card h2 { font-size: 20px; margin-bottom: 14px; }
      .nai-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
      .nai-field { display: block; margin-bottom: 14px; }
      .nai-field-label { display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); margin-bottom: 6px; }
      .nai-root input[type=number], .nai-root input[type=text], .nai-root select {
        width: 100%; padding: 10px 12px; border: 2px solid var(--rule); border-radius: 6px;
        background: var(--bg); color: var(--ink); font-size: 14px;
      }
      .nai-seg { display: flex; border: 2px solid var(--rule); border-radius: 999px; overflow: hidden; }
      .nai-seg-btn { flex: 1; padding: 9px 10px; background: none; border: none; cursor: pointer; font-size: 13px; color: var(--ink); }
      .nai-seg-btn.active { background: var(--ink); color: var(--bg); }
      .nai-stat-strip { display: flex; gap: 18px; margin-top: 6px; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--muted); }
      .nai-stat-strip div { display: flex; align-items: center; gap: 6px; }
      .nai-stat-strip b { color: var(--ink); }
      .nai-checkbox { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--muted); cursor: pointer; }
      .nai-macro-preview { display: flex; gap: 14px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--muted); margin: 10px 0; }
      .nai-generate { display: flex; margin: 28px auto 40px; }

      /* multiselect */
      .nai-multiselect { position: relative; }
      .nai-chip-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
      .nai-chip {
        display: inline-flex; align-items: center; gap: 6px; background: var(--ink); color: var(--bg);
        padding: 5px 10px; border-radius: 999px; font-size: 12px;
      }
      .nai-chip button { background: none; border: none; color: var(--bg); cursor: pointer; display: flex; }
      .nai-search-wrap { position: relative; }
      .nai-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--muted); }
      .nai-search-input {
        width: 100%; padding: 10px 12px 10px 32px; border: 2px solid var(--rule); border-radius: 6px;
        background: var(--bg); color: var(--ink); font-size: 13px;
      }
      .nai-dropdown {
        position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 20;
        background: var(--bg); border: 2px solid var(--rule); border-radius: 8px; max-height: 220px; overflow-y: auto;
      }
      .nai-dropdown-item {
        width: 100%; display: flex; justify-content: space-between; padding: 9px 12px;
        background: none; border: none; text-align: left; cursor: pointer; font-size: 13px; color: var(--ink);
      }
      .nai-dropdown-item:hover { background: var(--surface); }
      .nai-dropdown-meta { color: var(--muted); font-family: 'JetBrains Mono', monospace; font-size: 11px; }

      /* DASHBOARD */
      .nai-dashboard { max-width: 1180px; margin: 0 auto; padding: 32px 28px; }
      .nai-dash-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
      .nai-tag {
        font-family: 'JetBrains Mono', monospace; font-size: 12px; text-transform: uppercase;
        border: 2px solid var(--accent-orange); color: var(--accent-orange); padding: 6px 12px; border-radius: 999px;
      }
      .nai-toolbar-actions { display: flex; gap: 10px; flex-wrap: wrap; }
      .nai-dash-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 28px; align-items: start; }
      .chart-card h3 { font-size: 15px; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 6px; }

      .nai-meals { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
      .nai-meal-card { border: 2px solid var(--rule); border-radius: 10px; overflow: hidden; background: var(--surface); }
      .nai-meal-head { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; border-bottom: 2px solid var(--rule); }
      .nai-meal-head h3 { font-size: 17px; }
      .nai-meal-head span { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--accent-orange); font-weight: 700; }
      .nai-meal-table { width: 100%; border-collapse: collapse; font-size: 12px; }
      .nai-meal-table th {
        text-align: left; padding: 8px 12px; font-size: 10.5px; text-transform: uppercase;
        color: var(--muted); border-bottom: 1px solid var(--rule);
      }
      .nai-meal-table td { padding: 8px 12px; border-bottom: 1px solid color-mix(in srgb, var(--rule) 15%, transparent); }
      .nai-empty { text-align: center; color: var(--muted); padding: 18px; font-family: 'Oswald', sans-serif; }

      .nai-footer {
        text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 10.5px;
        letter-spacing: 0.1em; color: var(--muted); margin-top: 40px;
      }

      @media (max-width: 860px) {
        .nai-hero { grid-template-columns: 1fr; padding: 40px 20px; }
        .nai-hero h1 { font-size: 36px; }
        .nai-label-card { margin: 0 auto; }
        .nai-form-grid { grid-template-columns: 1fr; }
        .nai-dash-grid { grid-template-columns: 1fr; }
        .nai-meals { grid-template-columns: 1fr; }
        .nai-nav-links { display: none; }
      }

      @media print {
        .no-print, .nai-nav, .nai-footer { display: none !important; }
        .nai-root { background: #fff; color: #000; }
        .nai-meals { grid-template-columns: 1fr 1fr; }
      }
    `}</style>
  );
}
