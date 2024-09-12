import random
import string
class CodeGeneratorManager:
    def gen_random_letters(self) -> list:
        return random.choices(string.ascii_letters, k=8)
    
    def gen_random_number(self):
        return random.randint(1000, 99000)
    
    def gen_random_code(self) -> string:
        return f'{self.gen_random_number()}' + ''.join(self.gen_random_letters())