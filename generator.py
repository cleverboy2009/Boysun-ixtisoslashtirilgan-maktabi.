import json
import random

def generate_timetable_json():
    classes = [
        '5-A', '5-B', '6-A',
        '7-A', '7-B', '7-V',
        '8-A', '8-B', '8-V',
        '9-A', '9-B', '9-V',
        '10-A', '10-B', '10-V',
        '11-A', '11-B', '11-V'
    ]
    days = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma']
    subjects = ['Matematika', 'O\'zbek tili', 'Ingliz tili', 'Tarix', 'Fizika', 'Kimyo', 'Biologiya', 'Informatika', 'Adabiyot', 'Geografiya', 'Jismoniy tarbiya']

    data = {}
    for cls in classes:
        data[cls] = {}
        for day in days:
            lessons = []
            num = random.randint(5, 7)
            for i in range(1, num + 1):
                lessons.append({
                    "lesson": i,
                    "subject": random.choice(subjects)
                })
            data[cls][day] = lessons

    with open('timetable_data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    
    print("Timetable data has been generated successfully in Python.")

if __name__ == "__main__":
    generate_timetable_json()
