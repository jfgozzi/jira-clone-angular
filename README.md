[![Playwright Tests](https://github.com/jfgozzi/jira-clone-angular/actions/workflows/playwright.yml/badge.svg)](https://github.com/jfgozzi/jira-clone-angular/actions/workflows/playwright.yml)
# 🧪 E2E Test Automation - Jira Clone (Playwright)




This repository contains a comprehensive suite of End-to-End (E2E) automated tests for a functional Jira clone, built from scratch using **Playwright** and **TypeScript**.

The primary goal of this project is not just to validate the UI, but to showcase the implementation of industry-standard automation design patterns, complex asynchronous handling, and true cross-browser stability.

## 🚀 Technologies & Tools
* **E2E Framework:** Playwright
* **Language:** TypeScript
* **Architecture Pattern:** Page Object Model (POM)
* **Continuous Integration:** GitHub Actions (CI/CD)

## 💡 Technical Challenges Overcome
Automating a modern web application built with Angular introduces specific synchronization hurdles. This project implements robust solutions for:

* **Rich Text Editor (Quill) Handling:** Advanced text injection techniques (DOM `evaluate` and sequential typing) to bypass event dropping issues specific to Firefox and WebKit.
* **Angular Virtual Scrollers:** Resolving *Actionability* and *Element outside viewport* errors by leveraging native DOM click execution.
* **Race Conditions & Auto-saves:** Strict control over asynchrony and network requests to ensure background database saves complete before executing assertions.
* **Dynamic Locators & Scoping:** Strict use of locator chaining to prevent false positives with generic UI elements (e.g., handling multiple "Save" buttons within the same DOM scope).
* **True Cross-Browser Testing:** The suite runs reliably across **Chromium, Firefox, and WebKit** without relying on flaky, hardcoded wait times.

## 🏗️ Architecture (Page Object Model)
The codebase is structured following DRY (Don't Repeat Yourself) principles and the Single Responsibility Principle.
* `/pages`: Classes encapsulating locators and actions specific to each UI screen (`CreatePage`, `IssueDetailPage`, `BoardPage`).
* `/specs`: Descriptive test files that orchestrate business flows using Page Objects.
* `/utils`: Shared helper functions (e.g., randomized dropdown selection) accessible across multiple pages.

## ⚙️ How to run locally

1. Clone this repository.
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```
4. Start the application locally (requires Angular CLI):
   ```bash
   npm start
   ```
5. In a new terminal window, run the tests using the Playwright UI mode:
   ```bash
   npx playwright test --ui
   ```

## 📊 Reporting
<img width="800" height="582" alt="resultstestsvideo-ezgif com-video-to-gif-converter-2" src="https://github.com/user-attachments/assets/efc723c3-2a48-40d0-8e5d-dcc44b32db66" />
Upon execution, Playwright generates an interactive HTML report featuring screenshots, video recordings, and a Trace Viewer for deep-dive debugging:
```bash
npx playwright show-report
```
