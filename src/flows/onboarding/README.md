# Flow 02 — Onboarding

This is an incremental addition to the existing WORLD React project.

Screens:
1. Splash
2. Welcome
3. Create Account
4. Welcome Back / Login
5. Interests
6. Feed Selection
7. Home

No production user, wallet, earnings, messages, or engagement records are hardcoded.

## Integration

Import the flow where your current app router mounts the next blueprint flow:

```jsx
import OnboardingFlow from "./flows/onboarding/OnboardingFlow";
import "./flows/onboarding/onboarding.css";

// Then render <OnboardingFlow /> for the onboarding entry route.
```

This does not require replacing the existing project ZIP. Add these files to the current repository and mount the flow from the existing router/app entry.
