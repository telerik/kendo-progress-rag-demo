
export const chartJsonSchema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "ChartAugmentedAnswer",
    "description": "Factual answer optionally accompanied by up to three bar charts reused or subset-filtered from retrieved context.",
    "type": "object",
    "required": ["answer", "charts"],
    "additionalProperties": false,
    "properties": {
        "answer": {
            "type": "string",
            "title": "Answer Text",
            "description": "Concise factual answer derived ONLY from retrieved context (no speculation, no restating the user question). Target ≤120 words (~≤900 characters). Must NOT describe the JSON itself.",
            "minLength": 1,
            "maxLength": 900
        },
        "charts": {
            "type": "array",
            "title": "Supporting Bar Charts",
            "description": "Zero to at most three bar charts directly supporting the answer. Each chart either reused verbatim from context or a strict filtered subset of an original (categories + aligned series indices). No fabrication, aggregation, or reordering.",
            "minItems": 0,
            "maxItems": 3,
            "items": { "$ref": "#/$defs/Chart" }
        }
    },
    "$defs": {
        "Chart": {
            "type": "object",
            "title": "Bar Chart",
            "description": "Represents a bar chart: a title, ordered categories (x-axis labels), and one or more aligned numeric series. After any filtering, every series.data length MUST equal categories length. No added or renamed keys.",
            "required": ["title", "categories", "series"],
            "additionalProperties": false,
            "properties": {
                "title": {
                    "type": "string",
                    "description": "Human-friendly concise chart title. Reuse original title if present; may add a clarifying qualifier only if present in source context."
                },
                "categories": {
                    "type": "array",
                    "description": "Ordered x-axis labels (time periods, product names, etc.). If a subset filter was applied, order must remain exactly as in the source chart for the selected labels.",
                    "items": {
                        "type": "string",
                        "minLength": 1,
                        "description": "Single category label."
                    },
                    "minItems": 1
                },
                "series": {
                    "type": "array",
                    "description": "One or more data series aligned with categories. Each series.data array length MUST match categories length exactly.",
                    "minItems": 1,
                    "items": { "$ref": "#/$defs/Series" }
                }
            }
        },
        "Series": {
            "type": "object",
            "title": "Bar Series",
            "description": "Single bar series. Data values must be raw numeric points taken directly from the source chart (or its filtered subset).",
            "required": ["name", "data"],
            "additionalProperties": false,
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Series label (e.g., a year, region, scenario). Must match original label when reused."
                },
                "data": {
                    "type": "array",
                    "description": "Numeric values aligned index-by-index with categories. No fabrication, interpolation, aggregation, or unit conversion.",
                    "minItems": 1,
                    "items": {
                        "type": "number",
                        "description": "Raw numeric value corresponding to the category at the same index."
                    }
                }
            }
        }
    },
    "examples": [
        {
            "answer": "In 2024, net sales rose modestly while services and gross margin expanded year over year.",
            "charts": [
                {
                    "title": "Net Sales by Category (2024 vs 2023)",
                    "categories": ["Product1", "Product2", "Product3", "Product4", "Service1"],
                    "series": [
                        { "name": "2024", "data": [201183, 29984, 26694, 37005, 96169] },
                        { "name": "2023", "data": [200583, 29357, 28300, 39845, 85200] }
                    ]
                }
            ]
        },
        {
            "answer": "No relevant chart data was found in the provided context.",
            "charts": []
        }
    ]
}