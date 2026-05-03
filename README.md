# 🧪 E2E Test Automation - Jira Clone (Playwright)

Este repositorio contiene una suite completa de pruebas End-to-End (E2E) automatizadas para un clon funcional de Jira, construida desde cero utilizando **Playwright** y **TypeScript**. 

El objetivo de este proyecto no es solo validar la interfaz de usuario, sino demostrar la aplicación de patrones de diseño de automatización, manejo de asincronía compleja y estabilidad en navegadores múltiples (Cross-Browser Testing).

## 🚀 Tecnologías y Herramientas
* **Framework E2E:** Playwright
* **Lenguaje:** TypeScript
* **Patrón de Arquitectura:** Page Object Model (POM)
* **Integración Continua:** GitHub Actions (CI/CD)

## 💡 Desafíos Técnicos Resueltos
Automatizar una aplicación moderna construida en Angular presenta desafíos particulares de sincronización. En este proyecto se implementaron soluciones robustas para:

* **Manejo de Rich Text Editors (Quill):** Técnicas avanzadas de inyección de texto (`page.evaluate` y tipeado secuencial) para bypassear la pérdida de eventos en Firefox y WebKit.
* **Angular Virtual Scrollers:** Solución de problemas de *Actionability* y *Element outside of the viewport* utilizando clics nativos del DOM.
* **Race Conditions y Auto-saves:** Control estricto de la asincronía y peticiones de red para asegurar que los cambios se guarden en la base de datos antes de las aserciones.
* **Locators Dinámicos y Scoping:** Uso estricto de encadenamiento de locators para evitar falsos positivos en botones genéricos (ej. múltiples botones "Save" en un mismo modal).
* **Cross-Browser Testing Real:** La suite se ejecuta de manera estable en **Chromium, Firefox y WebKit** sin usar `waitForTimeout` innecesarios.

## 🏗️ Arquitectura (Page Object Model)
El código está estructurado siguiendo principios DRY (Don't Repeat Yourself) y responsabilidad única.
* `/pages`: Clases que encapsulan los selectores (Locators) y las acciones específicas de cada pantalla (`CreatePage`, `IssueDetailPage`, `BoardPage`).
* `/specs`: Archivos de pruebas descriptivos que utilizan los Page Objects para ejecutar flujos de negocio.
* `/utils`: Funciones helper genéricas (ej. selección aleatoria de dropdowns) compartidas entre todas las páginas.

## ⚙️ Cómo ejecutar el proyecto localmente

1. Clonar este repositorio.
2. Instalar las dependencias de Node:
   ```bash
   npm install
