import sys
import PyPDF2

def buscar_no_pdf(pdf_path, pergunta):
    try:
        with open(pdf_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            texto_completo = ""
            for page in reader.pages:
                texto_completo += page.extract_text() + "\n"

            if pergunta.lower() in texto_completo.lower():
                return f"Encontrei algo sobre isso no regulamento do condomínio! Veja: {pergunta}"
            else:
                return "Desculpe, não encontrei essa informação no regulamento."
    
    except Exception as e:
        return f"Erro ao processar o PDF: {str(e)}"

if __name__ == "__main__":
    pdf_path = sys.argv[1]
    pergunta = sys.argv[2]
    resposta = buscar_no_pdf(pdf_path, pergunta)
    print(resposta)
