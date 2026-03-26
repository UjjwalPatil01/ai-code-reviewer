import json
import re
from typing import Dict, Any
from ..schemas.review import ReviewResponse, ReviewIssue

def parse_ai_response(text: str) -> ReviewResponse:
    """
    Parses raw AI text into a structured ReviewResponse.
    Extracts JSON, fixes simple issues, and fills missing fields.
    """
    # 1. Extract JSON from markdown code blocks or curly braces
    json_match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', text)
    if json_match:
        json_str = json_match.group(1)
    else:
        # Fallback: try to find anything between { and }
        start_idx = text.find('{')
        end_idx = text.rfind('}')
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            json_str = text[start_idx:end_idx+1]
        else:
            json_str = "{}"
            
    # 2. Fix broken JSON (e.g. trailing commas before closing brackets)
    json_str = re.sub(r',\s*([\}\]])', r'\1', json_str)
            
    # 3. Parse JSON securely
    try:
        data = json.loads(json_str)
    except json.JSONDecodeError:
        data = {}
        
    # 4. Fill missing fields & enforce types
    score = data.get('score', 100)
    if not isinstance(score, int):
        try:
            score = int(float(score))
        except (ValueError, TypeError):
            score = 100
            
    summary = data.get('summary', "No summary provided.")
    if not isinstance(summary, str):
        summary = str(summary)
        
    raw_issues = data.get('issues', [])
    if not isinstance(raw_issues, list):
        raw_issues = []
        
    issues = []
    for issue_data in raw_issues:
        if not isinstance(issue_data, dict):
            continue
            
        severity = issue_data.get('severity', 'info')
        if severity not in ['info', 'warning', 'error']:
            severity = 'info'
            
        line = issue_data.get('line')
        if line is not None and not isinstance(line, int):
            try:
                line = int(float(line))
            except (ValueError, TypeError):
                line = None
                
        issues.append(ReviewIssue(
            severity=severity,
            message=str(issue_data.get('message', 'No message provided.')),
            suggestion=str(issue_data.get('suggestion', 'No suggestion provided.')),
            line=line
        ))
        
    return ReviewResponse(score=score, issues=issues, summary=summary)
