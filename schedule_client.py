import requests

class ScheduleApiClient():
    def __init__(self, base_url):
        self.base_url = base_url

    def load_streets(self):
        response = requests.get(f"{self.base_url}/streets")
        return response.json()

    def load_addresses(self, street_id):
        addresses = requests.get(f"{self.base_url}/address-points/{street_id}")
        return addresses.json()

    def load_schedule(self, address_id):
        schedule = requests.get(f"{self.base_url}/trash-schedule/{address_id}")
        return schedule.json()