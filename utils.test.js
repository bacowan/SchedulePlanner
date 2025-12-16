const { timeToMinutes, minutesToTime, formatTemplate, generateSchedule } = require('./utils');

describe('timeToMinutes', () => {
    test('converts 08:00 to 480', () => {
        expect(timeToMinutes('08:00')).toBe(480);
    });

    test('converts 16:30 to 990', () => {
        expect(timeToMinutes('16:30')).toBe(990);
    });
});

describe('minutesToTime', () => {
    test('converts 480 to 08:00', () => {
        expect(minutesToTime(480)).toBe('08:00');
    });

    test('converts 990 to 16:30', () => {
        expect(minutesToTime(990)).toBe('16:30');
    });

    test('handles wrap around 24:00', () => {
        expect(minutesToTime(1440)).toBe('00:00');
    });
});

describe('formatTemplate', () => {
    test('formats object to pretty JSON', () => {
        const obj = { a: 1, b: 2 };
        expect(formatTemplate(obj)).toBe('{\n  "a": 1,\n  "b": 2\n}');
    });
});

describe('generateSchedule', () => {
    const template = JSON.stringify({
        "default-start": "16:10",
        times: [
            { "default-length": 5, description: "Task 1" },
            { "default-length": 10, description: "Task 2" }
        ]
    });

    test('generates schedule for exact time match', () => {
        const result = generateSchedule(template, '16:10', '16:25');
        expect(result).toContain('16:10 - 16:15 (5分) Task 1');
        expect(result).toContain('16:15 - 16:25 (10分) Task 2');
    });

    test('scales schedule proportionally for different time span', () => {
        const result = generateSchedule(template, '16:10', '17:10');
        expect(result).toContain('16:10 - 16:30 (20分) Task 1');
        expect(result).toContain('16:30 - 17:10 (40分) Task 2');
    });

    test('scales schedule proportionally for shorter time span', () => {
        const result = generateSchedule(template, '16:10', '16:20');
        expect(result).toContain('16:10 - 16:13 (3分) Task 1');
        expect(result).toContain('16:13 - 16:20 (7分) Task 2');
    });

    test('handles invalid JSON', () => {
        const result = generateSchedule('invalid json', '16:10', '16:25');
        expect(result).toBe("Could not parse JSON template\n");
    });
});