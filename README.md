# Schedule Planner
Tool for planning recurring itineraries where the time span might vary slightly. For example, if you expect that every day you will have at 16:00 an opening, 16:10 the body of the event, and then 16:50-17:00 closing, you can use this tool to automatically adjust the times if things happen to start late or early.

# Usage
You can select a template from the dropdown, or insert your own in the text box.

## Template Format
The template is a JSON object with these properties:

- `default-start`: A string representing the default start time in "HH:MM" format (24-hour time)
- `times`: An array of activity objects, where each activity has:
  - `default-length`: A number representing the default duration in minutes
  - `description`: A string describing the activity

### Example
```json
{
  "default-start": "16:10",
  "times": [
    {
      "default-length": 5,
      "description": "Opening ceremony"
    },
    {
      "default-length": 10,
      "description": "Main discussion"
    }
  ]
}
```

Select a start and end time, then click on Generate.