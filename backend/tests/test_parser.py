import unittest
from api.utils.parser import parse_ai_response

class TestParser(unittest.TestCase):
    def test_valid_json_extraction(self):
        raw_ai = '''Here is your result:
        ```json
        {"score": 95, "summary": "Great", "issues": []}
        ```'''
        res = parse_ai_response(raw_ai)
        self.assertEqual(res.score, 95)
        self.assertEqual(res.summary, "Great")
        self.assertEqual(len(res.issues), 0)

    def test_broken_json_recovery(self):
        # Missing schema fields and trailing comma
        raw_ai = '{"score": "80", "issues": [{"message": "msg"},]}'
        res = parse_ai_response(raw_ai)
        self.assertEqual(res.score, 80)
        self.assertEqual(res.summary, "No summary provided.")
        self.assertEqual(len(res.issues), 1)
        self.assertEqual(res.issues[0].severity, "info")

if __name__ == '__main__':
    unittest.main()
