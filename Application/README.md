# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

## Machine‑learning prediction service

The repository ships with a trained XGBoost model (`src/xgb_water_potability_model.joblib`). To make use of it from the browser you need to run a small Python API.  Follow these steps:

1. **Prepare the Python environment** in `server/`:
   ```sh
   cd server
   python -m venv .venv             # create virtual env
   .\.venv\Scripts\activate      # windows
   pip install -r requirements.txt  # install dependencies
   ```

2. **Run the service**:
   ```sh
   uvicorn main:app --reload
   ```
   The app listens on `http://localhost:8000` and exposes a `POST /api/predict` endpoint.

3. **Front‑end proxy**: Vite is configured to proxy `/api` to the backend (see `vite.config.ts`), so the React code can just `fetch('/api/predict', …)`.

4. **Payload/response**:
   ```json
   // request body
   {
     "ph": 7.1,
     "hardness": 180,
     "solids": 20000,
     "chloramines": 7,
     "sulfate": 300,
     "conductivity": 400,
     "organic_carbon": 14,
     "trihalomethanes": 60,
     "turbidity": 3.5
   }
   // response body
   { "prediction": 0|1, "probability": [p0, p1] }
   ```

The `useWaterSimulation` hook is already updated to call this endpoint on every sensor update.  It stores the latest prediction in `predictedPotability` and also attaches it to each entry in `riskHistory`, so any component consuming the hook can display or react to the model's output.

