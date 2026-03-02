# Estrutura do questions.json

## Visão Geral

O arquivo `questions.json` contém **710 questões** do exame AWS SAA-C03, extraídas do `README.md`.

É um **array JSON** onde cada elemento representa uma questão.

---

## Estrutura de uma Questão

```json
{
  "question": "string",
  "options": ["string", "string", ...],
  "correct": "string" | ["string", "string", ...]
}
```

### Campos

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `question` | `string` | Texto completo da pergunta |
| `options` | `string[]` | Array com todas as alternativas disponíveis |
| `correct` | `string` ou `string[]` | Resposta(s) correta(s) |

---

## O campo `correct`: dois formatos possíveis

### 1. Resposta única — `string`

Usado quando a questão tem **uma única resposta correta** (655 questões).

```json
{
  "question": "Which set of Amazon S3 features helps to prevent and recover from accidental data loss?",
  "options": [
    "Object lifecycle and service access logging.",
    "Object versioning and Multi-factor authentication.",
    "Access controls and server-side encryption.",
    "Website hosting and Amazon S3 policies."
  ],
  "correct": "Object versioning and Multi-factor authentication."
}
```

### 2. Múltiplas respostas — `string[]`

Usado quando a questão pede para escolher **2 ou mais respostas** (55 questões).
Geralmente identificadas pelo enunciado com `(Choose 2 answers)`, `(Choose 3 answers)`, etc.

```json
{
  "question": "Which of the following are valid statements about Amazon S3? (Choose 2 answers)",
  "options": [
    "Amazon S3 provides read-after-write consistency for any type of PUT or DELETE.",
    "Consistency is not guaranteed for any type of PUT or DELETE.",
    "A successful response to a PUT request only occurs when a complete object is saved.",
    "Partially saved objects are immediately readable with a GET after an overwrite PUT.",
    "S3 provides eventual consistency for overwrite PUTS and DELETE."
  ],
  "correct": [
    "A successful response to a PUT request only occurs when a complete object is saved.",
    "S3 provides eventual consistency for overwrite PUTS and DELETE."
  ]
}
```

---

## Estatísticas

| Métrica | Valor |
|---------|-------|
| Total de questões | 710 |
| Resposta única | 655 |
| Múltiplas respostas | 55 |
| Questões com 2 opções | 26 |
| Questões com 3 opções | 24 |
| Questões com 4 opções | 590 |
| Questões com 5 opções | 57 |
| Questões com 6 opções | 12 |
| Questões com 7 opções | 1 |

---

## Como verificar o tipo de `correct` no código

Como `correct` pode ser `string` ou `string[]`, é necessário tratar os dois casos:

**JavaScript/TypeScript**
```js
if (Array.isArray(question.correct)) {
  // múltiplas respostas
} else {
  // resposta única
}
```

**Python**
```python
if isinstance(question["correct"], list):
    # múltiplas respostas
else:
    # resposta única
```

---

## Como checar se uma resposta está correta

**JavaScript**
```js
function isCorrect(question, selectedOption) {
  if (Array.isArray(question.correct)) {
    return question.correct.includes(selectedOption);
  }
  return question.correct === selectedOption;
}
```

**Python**
```python
def is_correct(question, selected_option):
    if isinstance(question["correct"], list):
        return selected_option in question["correct"]
    return question["correct"] == selected_option
```
