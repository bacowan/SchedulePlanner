const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { timeToMinutes, minutesToTime, formatTemplate, generateSchedule };
}

if (typeof window !== 'undefined') {
    window.timeToMinutes = timeToMinutes;
    window.minutesToTime = minutesToTime;
    window.formatTemplate = formatTemplate;
    window.generateSchedule = generateSchedule;
}