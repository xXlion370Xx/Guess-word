import random
import string
import requests 

class CodeGeneratorManager:
    def gen_random_letters(self) -> list:
        return random.choices(string.ascii_letters, k=8)
    
    def gen_random_number(self):
        return random.randint(1000, 99000)
    
    def gen_random_code(self) -> string:
        return f'{self.gen_random_number()}' + ''.join(self.gen_random_letters())
    
    def gen_random_word(self) ->string:
        url = requests.get('https://random-words-api.vercel.app/word/spanish')
        if url.status_code == 200:
            palabra = url.json()
            return (palabra[0]['word'], 200)
        else:
            return ("Ups, hubo un error al generar la palabra, intenta de nuevo :)", 400)
