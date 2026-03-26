from typing import List, Optional, Literal
from dataclasses import dataclass, asdict

@dataclass
class ReviewIssue:
    severity: Literal['info', 'warning', 'error']
    message: str
    suggestion: str
    line: Optional[int]

@dataclass
class ReviewResponse:
    score: int
    issues: List[ReviewIssue]
    summary: str

    def to_dict(self) -> dict:
        return asdict(self)
