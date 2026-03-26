import unittest
from api.validators import validate_review_request

class TestValidators(unittest.TestCase):
    def test_missing_payload(self):
        valid, msg, code = validate_review_request(None)
        self.assertFalse(valid)
        self.assertEqual(code, 400)
        
    def test_missing_code(self):
        valid, msg, code = validate_review_request({"language": "python"})
        self.assertFalse(valid)
        self.assertEqual(code, 400)
        
    def test_invalid_language(self):
        valid, msg, code = validate_review_request({"code": "print(1)", "language": "brainfuck"})
        self.assertFalse(valid)
        self.assertEqual(code, 400)
        
    def test_valid_payload(self):
        valid, msg, code = validate_review_request({"code": "print(1)", "language": "python"})
        self.assertTrue(valid)
        self.assertEqual(code, 200)

if __name__ == '__main__':
    unittest.main()
