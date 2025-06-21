# ext-prices Repository Structure

## Overview

The `ext-prices` repository contains the code for a web extension designed to retrieve and display external price data. It utilizes WXT for building the extension and likely interacts with web pages to extract information or display data.

## Directory Structure

```
ext-prices/
├── assets/
│   └── styles/
│       └── styles.css
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── ListItem.tsx
│   │   ├── Modal.tsx
│   │   └── RegisterBlock.tsx
│   ├── FloatingButton.tsx
│   ├── Popup.tsx
│   └── WelcomePopup.tsx
├── entrypoints/
│   ├── background/
│   │   ├── api/
│   │   │   ├── addLink.ts
│   │   │   ├── index.ts
│   │   │   ├── initRequest.ts
│   │   │   ├── makeRequest.ts
│   │   │   ├── readTasks.ts
│   │   │   └── updateTasks.ts
│   │   ├── QueueController.ts
│   │   ├── index.ts
│   │   ├── parserTab.ts
│   │   └── tasks.ts
│   ├── content/
│   │   ├── api/
│   │   │   ├── addItem.ts
│   │   │   ├── index.ts
│   │   │   ├── isParserTab.ts
│   │   │   └── sendRequest.ts
│   │   └── utils/
│   │       ├── index.ts
│   │       └── isMatch.ts
│   ├── content-injector.js
│   ├── htmlGetter.js
│   ├── popup/
│   │   ├── index.html
│   │   └── main.tsx
│   └── test/
│       └── index.html
├── public/
│   ├── icon/
│   │   ├── 128.png
│   │   ├── 16.png
│   │   ├── 32.png
│   │   ├── 48.png
│   │   └── 96.png
│   └── wxt.svg
├── store/
│   ├── folders.ts
│   ├── index.ts
│   ├── matches.ts
│   ├── parserTab.ts
│   ├── settings.ts
│   └── tasks.ts
├── types/
│   └── index.ts
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── README.md
├── structure.md
├── tsconfig.json
└── wxt.config.ts
```

## Key Files and Directories

*   `assets/styles/styles.css`: Contains the main stylesheet for the extension.
*   `components/`: Houses reusable UI components.
    *   `components/ui/`: Contains generic UI building blocks like buttons, inputs, etc.
    *   `components/FloatingButton.tsx`: A component for a floating action button.
    *   `components/Popup.tsx`: The main popup component for the extension UI.
    *   `components/WelcomePopup.tsx`: A component for a welcome or onboarding popup.
*   `entrypoints/`: Defines the different entry points for the web extension (background scripts, content scripts, popup).
    *   `entrypoints/background/`: Contains scripts that run in the extension's background process.
        *   `entrypoints/background/api/`: API-related functions for background scripts.
        *   `entrypoints/background/QueueController.ts`: Likely manages a queue of tasks.
        *   `entrypoints/background/index.ts`: The main background script entry point.
        *   `entrypoints/background/parserTab.ts`: Logic related to parser tabs.
        *   `entrypoints/background/tasks.ts`: Handles background tasks.
    *   `entrypoints/content/`: Contains scripts that interact with web pages.
        *   `entrypoints/content/api/`: API-related functions for content scripts.
        *   `entrypoints/content/utils/`: Utility functions for content scripts.
        *   `entrypoints/content/index.tsx`: The main content script entry point.
    *   `entrypoints/content-injector.js`: Script potentially used to inject content into pages.
    *   `entrypoints/htmlGetter.js`: Script likely for retrieving HTML content from pages.
    *   `entrypoints/popup/`: Contains the code for the extension's popup UI.
        *   `entrypoints/popup/index.html`: The HTML file for the popup.
        *   `entrypoints/popup/main.tsx`: The main script for the popup UI.
    *   `entrypoints/test/`: Contains files for testing purposes.
*   `public/`: Contains static assets like icons.
    *   `public/icon/`: Different sizes of the extension icon.
*   `store/`: Seems to contain Zustand or similar stores for managing application state.
    *   `store/folders.ts`: Store for managing folders.
    *   `store/index.ts`: Main store index.
    *   `store/matches.ts`: Store for managing matches.
    *   `store/parserTab.ts`: Store for managing parser tab state.
    *   `store/settings.ts`: Store for managing settings.
    *   `store/tasks.ts`: Store for managing tasks.
*   `types/index.ts`: Contains TypeScript type definitions.
*   `.gitignore`: Specifies intentionally untracked files that Git should ignore.
*   `package.json`: Project dependencies and scripts.
*   `pnpm-lock.yaml`: Lock file for pnpm package manager.
*   `postcss.config.mjs`: Configuration for PostCSS.
*   `README.md`: Provides a general description of the project.
*   `structure.md`: This file, describing the project structure.
*   `tsconfig.json`: TypeScript configuration file.
*   `wxt.config.ts`: Configuration file for the WXT framework.