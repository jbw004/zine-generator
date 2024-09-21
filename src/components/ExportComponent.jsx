import React, { useState } from 'react';

const ExportComponent = ({ templates, templateRefs }) => {
  const [exporting, setExporting] = useState(false);

  const exportTemplates = () => {
    setExporting(true);

    // Create a new document for the export view
    const exportDoc = document.implementation.createHTMLDocument('Export View');

    // Add necessary styles to the new document
    const style = exportDoc.createElement('style');
    style.textContent = `
      body { 
        background-color: #f0f0f0; 
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
      }
      .export-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        padding: 20px;
      }
      .template {
        background-color: white;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
        margin: 0;
        user-select: text;
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
      }
      .template * {
        user-select: text;
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
      }
      @media print {
        body {
          background-color: white;
        }
        .export-container {
          gap: 0;
        }
        .template {
          box-shadow: none;
          border-bottom: 1px solid #ccc;
          page-break-inside: avoid;
        }
        .template:last-child {
          border-bottom: none;
        }
      }
    `;
    exportDoc.head.appendChild(style);

    // Create a container for the React app
    const container = exportDoc.createElement('div');
    container.id = 'root';
    exportDoc.body.appendChild(container);

    // Add React and ReactDOM scripts
    const reactScript = exportDoc.createElement('script');
    reactScript.src = 'https://unpkg.com/react@17/umd/react.production.min.js';
    reactScript.defer = true;
    const reactDOMScript = exportDoc.createElement('script');
    reactDOMScript.src = 'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js';
    reactDOMScript.defer = true;
    exportDoc.head.appendChild(reactScript);
    exportDoc.head.appendChild(reactDOMScript);

    // Clone and process templates
    const processedTemplates = templates.map((template) => {
      const templateElement = templateRefs.current[template.uniqueId];
      if (templateElement) {
        const clonedTemplate = templateElement.cloneNode(true);
        
        // Remove the canvas controls
        const canvasControls = clonedTemplate.querySelector('.canvas-controls');
        if (canvasControls) {
          canvasControls.remove();
        }

        // Make all content non-editable
        clonedTemplate.querySelectorAll('*').forEach(element => {
          element.contentEditable = 'false';
          element.removeAttribute('data-text-id');
          element.removeAttribute('data-deletable');
        });

        return {
          ...template,
          content: clonedTemplate.outerHTML
        };
      }
      return template;
    });

    // Add a script to define and render our React component
    const appScript = exportDoc.createElement('script');
    appScript.textContent = `
      const ExportedMagazineView = ({ templates }) => {
        const [showFullMagazine, setShowFullMagazine] = React.useState(false);
      
        const coverTemplate = templates[0]; // Assuming the first template is always the cover
      
        const CoverCard = () => (
          React.createElement('div', {
            className: "cover-card",
            onClick: () => setShowFullMagazine(true),
            style: {
              width: '375px',
              height: '812px',
              margin: '20px auto',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              position: 'relative',
            }
          },
            React.createElement('div', { dangerouslySetInnerHTML: { __html: coverTemplate.content } }),
            React.createElement('div', {
              style: {
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
              }
            }, "Click to view full magazine")
          )
        );
      
        const FullMagazine = () => (
          React.createElement('div', { className: "export-container" },
            React.createElement('button', {
              onClick: () => setShowFullMagazine(false),
              style: {
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 1000,
              }
            }, "Close"),
            templates.map((template, index) => (
              React.createElement('div', {
                key: index,
                className: "template",
                dangerouslySetInnerHTML: { __html: template.content }
              })
            ))
          )
        );
      
        return React.createElement('div', { className: "exported-magazine-view" },
          showFullMagazine ? React.createElement(FullMagazine) : React.createElement(CoverCard)
        );
      };

      const templates = ${JSON.stringify(processedTemplates)};
      window.addEventListener('load', function() {
        ReactDOM.render(
          React.createElement(ExportedMagazineView, { templates: templates }),
          document.getElementById('root')
        );
      });
    `;
    exportDoc.body.appendChild(appScript);

    // Open the new document in a new tab
    const newTab = window.open();
    newTab.document.write(exportDoc.documentElement.outerHTML);
    newTab.document.close();

    setExporting(false);
  };

  return (
    <div className="export-container">
      <button
        onClick={exportTemplates}
        disabled={exporting}
        className={`export-button ${exporting ? 'exporting' : ''}`}
      >
        {exporting ? 'Exporting...' : 'Export Magazine'}
      </button>
    </div>
  );
};

export default ExportComponent;