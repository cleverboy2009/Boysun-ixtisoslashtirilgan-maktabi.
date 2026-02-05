const app = {
    selectedTeacher: null,
    selectedDay: null,
    teachers: [
        {
            name: "Choriyev Humoyiddin", subject: "Matematika", schedule: {
                "Dushanba": ["", "5-A", "6-A", "5-A", "5-A", "6-A", "", ""],
                "Seshanba": ["5-A", "6-A", "6-A", "5-A", "", "6-A", "", ""],
                "Chorshanba": ["6-A", "6-A", "6-A", "5-A", "6-A", "5-A", "5-A", ""],
                "Payshanba": ["5-A", "6-A", "", "6-A", "6-A", "5-A", "", ""],
                "Juma": ["5-A", "5-A", "5-A", "5-A", "5-A", "5-A", "5-A", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Aliyorova Feruza", subject: "Matematika", schedule: {
                "Dushanba": ["", "", "9-A", "9-A", "", "", "", ""],
                "Seshanba": ["", "", "9-A", "9-A", "", "", "", ""],
                "Chorshanba": ["", "", "9-A", "11-V", "", "", "", ""],
                "Payshanba": ["", "", "", "9-A", "11-V", "", "", ""],
                "Juma": ["", "", "11-V", "9-A", "", "", "", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Qilichev Samandar", subject: "Matematika", schedule: {
                "Dushanba": ["", "7-V", "10-B", "", "", "10-B", "", ""],
                "Seshanba": ["10-B", "8-V", "", "11-B", "11-B", "7-B", "10-B", ""],
                "Chorshanba": ["11-B", "", "11-B", "7-V", "7-V", "8-V", "10-B", ""],
                "Payshanba": ["", "7-B", "11-B", "11-B", "", "8-V", "7-B", ""],
                "Juma": ["", "", "11-B", "8-V", "10-B", "10-B", "10-B", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Axmadov Nurbek", subject: "Matematika", schedule: {
                "Dushanba": ["", "5-B", "10-B", "", "", "10-B", "9-B", ""],
                "Seshanba": ["10-B", "", "5-B", "11-V", "5-B", "7-B", "10-B", ""],
                "Chorshanba": ["", "5-B", "9-B", "11-B", "11-B", "10-B", "10-B", ""],
                "Payshanba": ["5-B", "7-B", "11-V", "11-V", "5-B", "7-B", "7-B", ""],
                "Juma": ["5-B", "", "", "", "10-B", "10-B", "", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Faxriddinov Nodir", subject: "Matematika", schedule: {
                "Dushanba": ["", "", "8-B", "7-A", "8-B", "10-V", "", ""],
                "Seshanba": ["", "7-A", "8-B", "11-B", "11-B", "10-V", "", ""],
                "Chorshanba": ["11-B", "7-A", "11-B", "7-B", "7-A", "8-B", "", ""],
                "Payshanba": ["8-B", "7-A", "11-B", "11-B", "7-A", "10-V", "", ""],
                "Juma": ["", "11-B", "11-B", "7-A", "8-B", "8-B", "", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Xudoyshukurov Jahongir", subject: "Matematika", schedule: {
                "Dushanba": ["", "5-B", "8-A", "9-B", "11-A", "11-A", "11-A", ""],
                "Seshanba": ["7-B", "", "5-B", "9-B", "5-B", "", "7-B", ""],
                "Chorshanba": ["", "5-B", "7-B", "7-B", "", "7-A", "10-V", ""],
                "Payshanba": ["5-B", "9-B", "11-A", "11-A", "5-B", "11-A", "", ""],
                "Juma": ["5-B", "", "11-A", "9-B", "7-B", "", "", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Qudratov Baxtiyor", subject: "Matematika", schedule: {
                "Dushanba": ["", "8-A", "", "7-A", "11-A", "8-A", "7-B", ""],
                "Seshanba": ["7-B", "7-A", "", "9-B", "", "10-A", "7-B", ""],
                "Chorshanba": ["5-B", "8-A", "7-B", "7-B", "", "7-A", "10-V", ""],
                "Payshanba": ["", "", "10-A", "9-B", "10-B", "8-B", "7-V", ""],
                "Juma": ["", "8-A", "8-A", "7-A", "7-B", "10-A", "10-V", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Avazova Mavluda", subject: "Fizika", schedule: {
                "Dushanba": ["", "11-B", "", "10-B", "11-B", "11-B", "7-B", ""],
                "Seshanba": ["7-A", "", "11-B", "7-B", "11-A", "11-A", "7-B", ""],
                "Chorshanba": ["11-B", "11-A", "11-A", "7-B", "7-B", "9-A", "", ""],
                "Payshanba": ["11-A", "8-V", "10-A", "9-B", "11-A", "8-B", "", ""],
                "Juma": ["11-A", "7-A", "9-A", "", "", "", "", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Asqarov Sherzod", subject: "Fizika", schedule: {
                "Dushanba": ["", "6-A", "8-A", "10-A", "10-B", "8-V", "", ""],
                "Seshanba": ["8-V", "", "", "10-A", "10-B", "8-B", "7-V", ""],
                "Chorshanba": ["8-B", "10-A", "", "11-A", "7-B", "7-V", "9-A", ""],
                "Payshanba": ["11-A", "8-A", "9-A", "9-B", "", "", "", ""],
                "Juma": ["10-A", "9-B", "", "10-B", "", "", "", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Raximov Bobomurod", subject: "Fizika", schedule: {
                "Dushanba": ["", "10-V", "8-V", "11-V", "9-V", "9-A", "8-V", ""],
                "Seshanba": ["", "8-A", "", "7-B", "8-B", "8-B", "7-B", ""],
                "Chorshanba": ["8-B", "", "11-A", "7-B", "8-A", "9-A", "", ""],
                "Payshanba": ["10-B", "8-A", "9-V", "7-A", "11-B", "", "", ""],
                "Juma": ["11-A", "9-B", "9-A", "", "", "", "", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "G'ofiyev Akmal", subject: "Fizika", schedule: {
                "Dushanba": ["", "10-V", "", "10-B", "11-V", "11-B", "8-B", ""],
                "Seshanba": ["7-A", "8-A", "11-B", "", "10-B", "", "", ""],
                "Chorshanba": ["", "", "", "10-B", "8-A", "", "", ""],
                "Payshanba": ["10-B", "11-B", "", "7-A", "11-B", "8-B", "", ""],
                "Juma": ["", "7-A", "", "10-B", "9-V", "11-B", "10-A", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Rashidova Go'zal", subject: "Rus tili", schedule: {
                "Dushanba": ["", "7-A", "5-A", "11-V", "10-B", "8-V", "8-B", ""],
                "Seshanba": ["9-A", "9-V", "7-B", "10-B", "9-B", "9-V", "11-A", ""],
                "Chorshanba": ["7-V", "", "", "", "7-B", "11-B", "", ""],
                "Payshanba": ["6-A", "11-B", "5-B", "8-V", "", "", "8-A", ""],
                "Juma": ["9-A", "7-V", "9-B", "", "11-A", "", "", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Rashidov S.", subject: "Rus tili", schedule: {
                "Dushanba": ["", "6-A", "8-A", "10-V", "5-A", "8-V", "7-B", ""],
                "Seshanba": ["9-A", "9-V", "7-B", "10-B", "9-B", "9-V", "11-A", ""],
                "Chorshanba": ["", "", "11-V", "7-A", "10-V", "7-B", "11-B", ""],
                "Payshanba": ["5-A", "11-B", "5-B", "7-A", "8-B", "11-V", "11-A", ""],
                "Juma": ["9-A", "", "7-B", "5-B", "11-A", "5-A", "7-A", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Rahmonova Z.", subject: "Geografiya", schedule: {
                "Dushanba": ["", "8-A", "8-V", "11-V", "9-V", "9-A", "8-B", ""],
                "Seshanba": ["", "", "", "", "", "", "", ""],
                "Chorshanba": ["7-V", "", "11-V", "7-A", "10-V", "5-A", "", ""],
                "Payshanba": ["6-A", "9-V", "5-B", "5-B", "8-B", "8-B", "11-V", ""],
                "Juma": ["", "7-V", "", "5-B", "", "", "7-A", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Nurboyeva Dilnoza", subject: "Biologiya", schedule: {
                "Dushanba": ["", "10-A", "8-V", "11-V", "9-V", "9-B", "8-B", ""],
                "Seshanba": ["10-V", "7-V", "7-A", "9-V", "8-V", "7-V", "", ""],
                "Chorshanba": ["10-V", "8-V", "8-V", "8-A", "11-V", "11-V", "", ""],
                "Payshanba": ["7-A", "9-V", "7-B", "", "10-V", "7-V", "11-V", ""],
                "Juma": ["7-V", "8-B", "7-A", "10-V", "11-V", "11-V", "11-V", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Qarorova Sarviniso", subject: "Biologiya", schedule: {
                "Dushanba": ["", "10-B", "7-V", "", "", "5-B", "", ""],
                "Seshanba": ["10-V", "7-V", "", "9-V", "8-V", "7-V", "", ""],
                "Chorshanba": ["10-V", "8-V", "8-V", "8-A", "11-V", "11-V", "9-V", ""],
                "Payshanba": ["8-V", "", "8-A", "5-B", "9-V", "9-B", "9-A", ""],
                "Juma": ["8-V", "7-B", "", "10-V", "6-A", "8-A", "", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Turdiyev S.", subject: "Geografiya", schedule: {
                "Dushanba": ["7-A", "5-A", "", "", "5-B", "", "", ""],
                "Seshanba": ["6-A", "11-A", "", "10-A", "5-B", "6-A", "8-B", ""],
                "Chorshanba": ["5-A", "9-A", "8-B", "9-V", "9-B", "7-V", "7-V", ""],
                "Payshanba": ["8-V", "", "8-A", "", "9-V", "9-B", "9-A", ""],
                "Juma": ["8-V", "7-B", "5-A", "", "6-A", "8-A", "11-V", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Shoymardonov M.", subject: "Jismoniy tarbiya", schedule: {
                "Dushanba": ["", "", "11-V", "8-B", "", "", "", ""],
                "Seshanba": ["11-A", "", "10-A", "", "", "", "", ""],
                "Chorshanba": ["", "", "5-A", "11-B", "5-B", "", "", ""],
                "Payshanba": ["", "", "", "", "", "", "", ""],
                "Juma": ["", "", "5-A", "", "5-B", "5-B", "", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Ne'matova L.", subject: "Jismoniy tarbiya", schedule: {
                "Dushanba": ["8-V", "10-V", "6-A", "6-A", "7-A", "9-V", "9-V", ""],
                "Seshanba": ["8-A", "9-B", "7-V", "7-V", "", "9-A", "", ""],
                "Chorshanba": ["10-V", "11-V", "10-V", "10-A", "5-A", "5-B", "", ""],
                "Payshanba": ["", "", "", "", "", "", "", ""],
                "Juma": ["", "", "", "", "", "", "", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Narziyeva B.", subject: "Ona tili", schedule: {
                "Dushanba": ["11-A", "", "", "", "", "", "", "11-V"],
                "Seshanba": ["", "11-B", "10-B", "", "", "10-B", "", ""],
                "Chorshanba": ["11-V", "9-B", "11-B", "9-V", "10-B", "", "", ""],
                "Payshanba": ["10-A", "10-B", "", "", "", "", "", ""],
                "Juma": ["8-B", "8-V", "9-B", "11-A", "10-A", "8-V", "8-A", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Eshqulova N.", subject: "Ona tili", schedule: {
                "Dushanba": ["", "", "11-B", "", "11-B", "", "9-A", ""],
                "Seshanba": ["", "10-B", "9-B", "", "10-V", "", "", "11-A"],
                "Chorshanba": ["9-B", "11-B", "9-V", "10-B", "9-A", "10-V", "", ""],
                "Payshanba": ["9-A", "10-B", "8-V", "8-B", "9-B", "8-A", "", ""],
                "Juma": ["10-B", "9-B", "10-V", "11-B", "11-B", "9-B", "", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Odilova S.", subject: "Ona tili", schedule: {
                "Dushanba": ["11-V", "7-B", "7-V", "7-A", "11-V", "8-B", "", ""],
                "Seshanba": ["7-V", "11-V", "", "", "", "11-A", "10-A", ""],
                "Chorshanba": ["", "", "", "", "9-V", "", "", ""],
                "Payshanba": ["8-A", "8-B", "8-B", "11-A", "8-V", "8-A", "8-V", ""],
                "Juma": ["7-A", "11-V", "", "", "9-V", "", "7-B", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Nayimov S.", subject: "Tarix", schedule: {
                "Dushanba": ["", "11-V", "7-B", "5-B", "9-B", "7-B", "5-A", ""],
                "Seshanba": ["", "7-V", "", "5-A", "", "8-V", "7-B", ""],
                "Chorshanba": ["", "", "8-A", "10-V", "10-V", "9-V", "10-B", ""],
                "Payshanba": ["", "7-V", "11-V", "9-A", "7-V", "10-A", "10-V", "11-B"],
                "Juma": ["7-A", "7-V", "10-V", "10-B", "", "5-B", "7-B", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Bo'riyev A.", subject: "Tarbiya", schedule: {
                "Dushanba": ["7-B", "5-B", "9-V", "5-A", "", "5-A", "", ""],
                "Seshanba": ["11-A", "", "", "5-A", "8-V", "6-A", "", ""],
                "Chorshanba": ["", "10-A", "5-B", "5-V", "8-B", "10-B", "", ""],
                "Payshanba": ["11-V", "", "5-A", "6-A", "", "", "", ""],
                "Juma": ["10-V", "10-B", "", "7-B", "6-A", "5-B", "", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Husanov N.", subject: "Tarix", schedule: {
                "Dushanba": ["", "9-V", "8-V", "7-A", "8-V", "", "", ""],
                "Seshanba": ["5-A", "8-B", "5-A", "11-V", "8-B", "8-A", "", ""],
                "Chorshanba": ["5-B", "5-V", "10-B", "10-V", "", "8-A", "9-B", ""],
                "Payshanba": ["10-V", "5-A", "10-B", "10-A", "10-V", "", "10-V", ""],
                "Juma": ["7-B", "10-V", "", "7-A", "8-A", "7-A", "7-A", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Mo'minov F.", subject: "Tarix", schedule: {
                "Dushanba": ["7-A", "8-A", "11-A", "11-V", "", "", "", ""],
                "Seshanba": ["8-B", "8-B", "11-V", "8-A", "11-V", "", "", ""],
                "Chorshanba": ["5-B", "8-B", "", "", "", "", "", ""],
                "Payshanba": ["", "", "", "5-B", "10-B", "8-V", "8-A", ""],
                "Juma": ["", "5-B", "9-V", "", "10-V", "7-B", "", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Rajabova M.", subject: "Tarix", schedule: {
                "Dushanba": ["11-B", "11-A", "7-V", "11-B", "", "", "11-B", ""],
                "Seshanba": ["9-V", "9-A", "", "", "9-A", "9-B", "9-B", ""],
                "Chorshanba": ["11-A", "", "", "", "", "", "", ""],
                "Payshanba": ["", "", "7-V", "", "11-A", "11-B", "", ""],
                "Juma": ["9-V", "7-V", "9-B", "9-B", "9-A", "9-A", "9-A", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Norboyeva O.", subject: "Biologiya", schedule: {
                "Dushanba": ["", "", "7-B", "7-A", "", "7-B", "7-A", ""],
                "Seshanba": ["", "", "", "", "", "5-A", "5-B", "7-A"],
                "Chorshanba": ["", "", "", "", "11-V", "11-V", "7-B", "7-B"],
                "Payshanba": ["9-B", "7-B", "", "", "5-A", "5-B", "6-A", "9-B"],
                "Juma": ["", "", "", "", "5-A", "5-B", "5-B", "6-A"],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Pardayev Jafar", subject: "Matematika", schedule: {
                "Dushanba": ["10A", "9A", "9A", "11A", "11A", "", "", ""],
                "Seshanba": ["10A", "", "", "9A", "9A", "7V", "11A", ""],
                "Chorshanba": ["9V", "", "", "9A", "10A", "9V", "11A", ""],
                "Payshanba": ["8B", "10A", "11A", "9A", "8A", "", "11A", ""],
                "Juma": ["9V", "9V", "11A", "9V", "8B", "8B", "10A", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Sattorova Farogat", subject: "Matematika", schedule: {
                "Dushanba": ["8A", "8B", "9B", "8B", "8A", "8A", "9B", ""],
                "Seshanba": ["", "", "", "8B", "9B", "8A", "11A", ""],
                "Chorshanba": ["8A", "9V", "9B", "9B", "", "", "8B", ""],
                "Payshanba": ["8B", "9B", "", "8A", "", "", "8A", ""],
                "Juma": ["9V", "8A", "8A", "8B", "8B", "8B", "10A", ""],
                "Shanba": ["", "", "", "", "", "", "", "10V"]
            }
        },
        {
            name: "Xursandov Zarif", subject: "Informatika", schedule: {
                "Dushanba": ["8B", "8B", "6A", "5B", "8A", "6A", "", ""],
                "Seshanba": ["11B", "7B", "", "11A", "7A", "8A", "", ""],
                "Chorshanba": ["9A", "9B", "7A", "8B", "7B", "10B", "", ""],
                "Payshanba": ["9V", "9A", "5A", "5B", "9B", "", "", ""],
                "Juma": ["11B", "11A", "10B", "5A", "11V", "10V", "7V", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Roziqov Azamat", subject: "Informatika", schedule: {
                "Dushanba": ["8B", "8B", "", "5B", "", "", "8V", ""],
                "Seshanba": ["11B", "7B", "", "11A", "", "", "11V", ""],
                "Chorshanba": ["", "9B", "9B", "8B", "7B", "10B", "", ""],
                "Payshanba": ["", "", "", "5B", "9B", "", "11V", ""],
                "Juma": ["11B", "11A", "10B", "", "11V", "10V", "7V", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "To'rayev Abduhakim", subject: "Kimyo", schedule: {
                "Dushanba": ["9B", "7V", "8V", "10V", "9V", "11V", "11V", ""],
                "Seshanba": ["", "10V", "10V", "8V", "11V", "11V", "8V", ""],
                "Chorshanba": ["7B", "11V", "7V", "8V", "", "", "8B", ""],
                "Payshanba": ["7V", "11V", "10V", "11V", "10V", "7B", "9B", "8B"],
                "Juma": ["8A", "10V", "8V", "11V", "11V", "10V", "8B", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Tojiyev Sultonmurod", subject: "Kimyo", schedule: {
                "Dushanba": ["9A", "7V", "8V", "10V", "9V", "11V", "11V", ""],
                "Seshanba": ["", "10V", "10V", "8V", "11V", "11V", "8V", ""],
                "Chorshanba": ["11V", "11V", "7V", "8V", "", "8A", "7A", ""],
                "Payshanba": ["7V", "11V", "10V", "11V", "10V", "9A", "7A", ""],
                "Juma": ["8A", "10V", "8V", "11V", "11V", "10V", "8B", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Samatov F.", subject: "Ingliz tili", schedule: {
                "Dushanba": ["", "9B", "", "5B", "", "", "8A", ""],
                "Seshanba": ["9B", "9B", "", "8V", "", "", "11B", ""],
                "Chorshanba": ["8V", "", "8A", "5B", "", "11B", "9B", ""],
                "Payshanba": ["11B", "5B", "8V", "", "8A", "", "", ""],
                "Juma": ["9B", "11B", "5B", "", "8V", "", "", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Umarova Y.", subject: "Ingliz tili", schedule: {
                "Dushanba": ["", "", "", "", "9A", "7V", "10V", ""],
                "Seshanba": ["", "11V", "6A", "6A", "", "", "10V", ""],
                "Chorshanba": ["6-A", "7-V", "", "10-V", "6-A", "11-V", "11-V", ""],
                "Payshanba": ["9A", "6A", "11V", "10V", "", "", "", ""],
                "Juma": ["11V", "11B", "7V", "6A", "6A", "9V", "7V", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Kenjaboyev X.", subject: "Ingliz tili", schedule: {
                "Dushanba": ["10B", "10A", "", "", "", "", "10V", ""],
                "Seshanba": ["11V", "10A", "11A", "", "10A", "11B", "10V", ""],
                "Chorshanba": ["10B", "7V", "10B", "", "11A", "11A", "11V", ""],
                "Payshanba": ["11B", "11A", "11V", "10V", "8B", "10B", "", ""],
                "Juma": ["11V", "11B", "", "", "8B", "9A", "11A", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        },
        {
            name: "Ismoilov Damir", subject: "Ingliz tili", schedule: {
                "Dushanba": ["5A", "", "5A", "7B", "", "", "8A", ""],
                "Seshanba": ["", "6A", "11A", "7A", "7B", "6A", "9V", ""],
                "Chorshanba": ["7A", "7B", "6A", "5A", "11A", "7A", "5A", ""],
                "Payshanba": ["7B", "11A", "7A", "6A", "6A", "5A", "", ""],
                "Juma": ["5A", "", "5A", "", "5A", "", "9V", ""],
                "Shanba": ["", "", "", "", "", "", "", ""]
            }
        }
    ],
    days: ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"],

    init() {
        this.renderTeachers();
        this.setupTheme();
        this.loadTheme();
    },

    renderTeachers() {
        const grid = document.getElementById('teachers-list');
        grid.innerHTML = this.teachers.map(t => `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="glass-card cursor-pointer p-3 d-flex align-items-center gap-3" onclick="app.selectTeacher('${t.name}')" style="cursor:pointer">
                    <div class="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style="width:50px; height:50px">
                        <i class="fas fa-user-tie text-primary"></i>
                    </div>
                    <div>
                        <h3 class="h6 mb-0 fw-bold">${t.name}</h3>
                        <p class="small text-muted mb-0">${t.subject || ''}</p>
                    </div>
                    <i class="fas fa-chevron-right ms-auto text-muted small"></i>
                </div>
            </div>
        `).join('');
    },

    selectTeacher(name) {
        this.selectedTeacher = this.teachers.find(t => t.name === name);
        document.getElementById('selected-teacher-name').innerText = name;
        this.renderDays();
        this.transition('teacher-selection-view', 'teacher-day-view');
    },

    renderDays() {
        const grid = document.getElementById('teacher-days-grid');
        grid.innerHTML = this.days.map(d => `
            <div class="col-6 col-md-4">
                <div class="day-square" onclick="app.selectDay('${d}')">
                    <h3>${d}</h3>
                </div>
            </div>
        `).join('');
    },

    selectDay(day) {
        this.selectedDay = day;
        document.getElementById('display-teacher-day').innerText = day;
        document.getElementById('display-teacher-name-title').innerText = this.selectedTeacher.name;
        this.renderHours();
        this.transition('teacher-day-view', 'teacher-schedule-view');
    },

    renderHours() {
        const body = document.getElementById('teacher-hour-body');
        const daySchedule = this.selectedTeacher.schedule[this.selectedDay] || ["", "", "", "", "", "", "", ""];
        body.innerHTML = daySchedule.map((cls, index) => `
            <tr>
                <td><span class="lesson-num">${index + 1}</span></td>
                <td><span class="${cls === '' ? 'text-muted opacity-25' : 'subject-name'} text-center">${cls}</span></td>
            </tr>
        `).join('');
    },

    showTeachers() {
        this.transition('teacher-day-view', 'teacher-selection-view');
    },

    showTeacherDays() {
        this.transition('teacher-schedule-view', 'teacher-day-view');
    },

    transition(from, to) {
        document.getElementById(from).classList.add('d-none');
        document.getElementById(to).classList.remove('d-none');
        window.scrollTo(0, 0);
    },

    setupTheme() {
        const btn = document.getElementById('theme-toggle');
        btn.onclick = () => {
            const isLight = document.body.classList.toggle('light-mode');
            btn.querySelector('i').className = isLight ? 'fas fa-moon' : 'fas fa-sun';
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        };
    },

    loadTheme() {
        const saved = localStorage.getItem('theme');
        if (saved === 'light') {
            document.body.classList.add('light-mode');
            const btn = document.querySelector('#theme-toggle i');
            if (btn) btn.className = 'fas fa-moon';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
