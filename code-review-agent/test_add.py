import unittest

def add(a, b):
    """Basic add function for testing"""
    return a + b

class TestAddFunction(unittest.TestCase):
    
    def test_positive_numbers(self):
        """Test addition of positive numbers"""
        self.assertEqual(add(2, 3), 5)
        self.assertEqual(add(10, 20), 30)
    
    def test_negative_numbers(self):
        """Test addition of negative numbers"""
        self.assertEqual(add(-2, -3), -5)
        self.assertEqual(add(-10, -20), -30)
    
    def test_mixed_numbers(self):
        """Test addition of positive and negative numbers"""
        self.assertEqual(add(5, -3), 2)
        self.assertEqual(add(-10, 15), 5)
    
    def test_zero_values(self):
        """Test addition with zero values"""
        self.assertEqual(add(0, 5), 5)
        self.assertEqual(add(10, 0), 10)
        self.assertEqual(add(0, 0), 0)
    
    def test_float_numbers(self):
        """Test addition of floating point numbers"""
        self.assertEqual(add(2.5, 3.5), 6.0)
        self.assertEqual(add(1.1, 2.2), 3.3)

if __name__ == '__main__':
    unittest.main()