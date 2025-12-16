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
        templateTextarea.value = JSON.stringify(templates[defaultSelected], null, 2);
        setTimesFromTemplate(templates[defaultSelected]);
    }

    // On select change, load template content
    select.addEventListener('change', function() {
        const selected = select.value;
        if (selected && templates[selected]) {
            templateTextarea.value = JSON.stringify(templates[selected], null, 2);
            setTimesFromTemplate(templates[selected]);
        } else {
            templateTextarea.value = '';
        }
    });

    // On generate button click, add text to output
    generateButton.addEventListener('click', function(event) {
        event.preventDefault();
        outputTextarea.value += generateSchedule(
            templateTextarea.value,
            startTimeInput.value,
            endTimeInput.value);
    });

    function setTimesFromTemplate(template) {
        startTimeInput.value = template["default-start"];
        const totalMinutes = template.times.reduce((sum, item) => sum + item["default-length"], 0);
        const [hours, minutes] = template["default-start"].split(':').map(Number);
        const totalMins = hours * 60 + minutes + totalMinutes;
        const endHours = Math.floor(totalMins / 60) % 24;
        const endMinutes = totalMins % 60;
        endTimeInput.value = `${endHours.toString().padStart(2,'0')}:${endMinutes.toString().padStart(2,'0')}`;
    }
});

const formatTemplate = (template) => {
    return JSON.stringify(template, null, 2);
}

const generateSchedule = (template, startTime, endTime) => {
    try {
        const parsedTemplate = JSON.parse(template);
        
        return template;
    }
    catch (e) {
        if (e instanceof SyntaxError) {
            return "Could not parse JSON template"
        }
        else {
            return e.message
        }
    }
}