document.addEventListener('DOMContentLoaded', function() {
    const select = document.getElementById('template-select');
    const templateTextarea = document.getElementById('template-textarea');
    const outputTextarea = document.getElementById('output-textarea');
    const generateButton = document.getElementById('generate-button');
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');

    // Templates are loaded via templates.js
    const templates = window.templates;

    // Populate select options
    for (let template of Object.keys(templates)) {
        const option = document.createElement('option');
        option.value = template;
        option.textContent = template;
        select.appendChild(option);
    }

    // Load the default selected template
    const defaultSelected = select.value;
    if (defaultSelected && templates[defaultSelected]) {
        templateTextarea.value = formatTemplate(templates[defaultSelected]);
    }

    // On select change, load template content
    select.addEventListener('change', function() {
        const selected = select.value;
        if (selected && templates[selected]) {
            templateTextarea.value = formatTemplate(templates[selected]);
        } else {
            templateTextarea.value = '';
        }
    });

    // On generate button click, add text to output
    generateButton.addEventListener('click', function(event) {
        event.preventDefault();
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        const template = templateTextarea.value;
        // Simple generation: just append some text
        outputTextarea.value += `\nGenerated schedule from ${startTime} to ${endTime} using template:\n${template}\n`;
    });
});

const formatTemplate = (template) => {
    return JSON.stringify(template, null, 2);
}