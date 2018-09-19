# KachasiJS
Framework made in Vanilla JS (plain old JavaScript) and JQuery. Works with views and components while being extremly lightweight.

Use per RawGit CDN:

`<script type="text/javascript" src="https://cdn.rawgit.com/eliareutlinger/KachasiJS/master/Engine/engine.min.js"></script>`

## Default Setup (local)
Everything needed to run KachasiJS is a simple Apache-Server (for window.pushstate events).
You can use the Template provided with this repo or create your own basic structure:

```
index.html
App/
├── start.min.js
├── component/
│   └── exampleComponent/
│       ├── exampleComponent.html
│       ├── js/
│       │   ├── functions.js
│       │   └── execute.js
│       └── css/
│           └── style.css
└── view/
    └── exampleView/
        ├── exampleView.js
        └── exampleView.min.js
```
