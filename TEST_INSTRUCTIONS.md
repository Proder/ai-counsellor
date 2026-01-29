# 🧪 AI Counsellor: Comprehensive Test Walkthrough

Follow these steps to verify that every part of the application is working correctly, personalized, and responsive.

## 1. Landing & Authentication
- [ ] **Desktop View**: Open `http://localhost:3000`. Verify the premium "Elite Study Advisory" landing page.
- [ ] **Mobile View**: Shrink the browser or use DevTools. Verify the hero text scales and buttons are centered.
- [ ] **Signup**: Click "Initialize Portal" or "Signup". Enter your email and password.
- [ ] **Personalization Check**: Ensure you are redirected to Onboarding.

## 2. Onboarding (The Profile Engine)
- [ ] **Step 1 (Academic)**: Enter your **Full Name** (e.g., "Alex Smith"). This is critical for personalization.
- [ ] **Step 2 (Goal)**: Select "Masters" or "MBA", a field, and preferred countries.
- [ ] **Step 3 (Budget)**: Select a budget range and funding source.
- [ ] **Step 4 (Readiness - *MOBILE FIX*)**: Click on "IELTS", "GRE", etc. Verify they toggle correctly and look good on small screens.
- [ ] **Submission**: Click "Complete Profile". Verify the toast notification ("Profile saved successfully!").

## 3. Dashboard (Personalized Overview)
- [ ] **Greeting**: You should see "Hello, Alex!". If you didn't enter a name, you'll see your email prefix.
- [ ] **Stage Indicator**: Verify the "Application Lifecycle" shows "Discovery" active.
- [ ] **AI Scan**: Click the "Profile Scan" button. Verify the "SCANNING..." state and the toast notification completion.
- [ ] **Task Engine**: Mark an AI-generated task as completed. Verify the toast notification.
- [ ] **Mobile Sidebar**: Click the menu button in the top-right (mobile header). Verify the sidebar slides in ABOVE the header with an overlay behind it.

## 4. University Discovery (Data Integration)
- [ ] **Search**: Type **"Stanford"** or **"MIT"**. Verify results appear with "Verified Metrics" badges.
- [ ] **Fuzzy Search**: Type **"Harvard"**. Even if the API is slow, our fallback system will ensure Harvard appears.
- [ ] **Shortlist**: Click the "Shortlist" button on a university card. Verify the toast notification.

## 5. Decision Pipeline (My Shortlist)
- [ ] **Categorization**: View your shortlisted universities.
- [ ] **Locking**: Click the "Lock Decision" button on a university.
- [ ] **Stage Transition**: Locking a university automatically moves you to "Stage 4: Applications". Notice the Sidebar item "Applications" is now unlocked.

## 6. AI Counsellor (The Smart Agent)
- [ ] **Context**: Ask "What is my current progress?". The AI should know your name and your target degree.
- [ ] **Action Trigger**: Type "Can you shortlist Harvard for me?".
- [ ] **Verification**: The AI should respond and trigger an `[ACTION]`. Check your "My Shortlist" page; Harvard should now be there automatically!
- [ ] **Stability**: Verify the chat input doesn't reload the page and works smoothly on mobile.

## 7. Application Roadmap
- [ ] **Active Track**: Once a university is locked, visit this page. Verify you see the specific roadmap for your chosen institution.
- [ ] **Checklist**: Interact with the document requirements and deadlines.

---
**Key Fixes Applied:**
- ✅ **Layering**: Sidebar is now `z-[100]`, Overlay `z-[80]`, Mobile Header `z-[40]`.
- ✅ **Alerts**: All standard `alert()` boxes replaced with modern `sonner` toasts.
- ✅ **Personalization**: Welcome greeting uses your chosen name or email prefix.
- ✅ **Responsiveness**: All pages, especially "Readiness" toggles and Dashboard grid, are mobile-ready.
