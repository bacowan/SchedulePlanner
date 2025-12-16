document.addEventListener('DOMContentLoaded', function() {
    const select = document.getElementById('template-select');
    const templateTextarea = document.getElementById('template-textarea');
    const outputTextarea = document.getElementById('output-textarea');
    const generateButton = document.getElementById('generate-button');
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');
    const copyButton = document.getElementById('copy-button');
    const copyMessage = document.getElementById('copy-message');

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
        outputTextarea.value = generateSchedule(
            templateTextarea.value,
            startTimeInput.value,
            endTimeInput.value);
    });

    // On copy button click, copy to clipboard
    copyButton.addEventListener('click', function() {
        navigator.clipboard.writeText(outputTextarea.value).then(() => {
            copyMessage.textContent = 'Copied!';
            copyMessage.style.display = 'inline';
            setTimeout(() => {
                copyMessage.style.display = 'none';
            }, 1000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            copyMessage.textContent = 'Copy failed';
            copyMessage.style.display = 'inline';
            copyMessage.style.color = 'red';
            setTimeout(() => {
                copyMessage.style.display = 'none';
                copyMessage.style.color = 'green';
            }, 1000);
        });
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
        const totalDefault = parsedTemplate.times.reduce((sum, item) => sum + item["default-length"], 0);
        const startMinutes = timeToMinutes(startTime);
        const endMinutes = timeToMinutes(endTime);
        const totalActual = endMinutes - startMinutes;
        
        let current = startMinutes;
        const output = [];
        
        for (const item of parsedTemplate.times) {
            const actualLength = Math.round((item["default-length"] / totalDefault) * totalActual);
            const itemStart = current;
            const itemEnd = current + actualLength;
            output.push(`${minutesToTime(itemStart)} - ${minutesToTime(itemEnd)} (${actualLength}分) ${item.description}`);
            current = itemEnd;
        }
        
        return output.join('\n') + '\n';
    }
    catch (e) {
        if (e instanceof SyntaxError) {
            return "Could not parse JSON template\n"
        }
        else {
            return e.message + '\n'
        }
    }
}

const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}