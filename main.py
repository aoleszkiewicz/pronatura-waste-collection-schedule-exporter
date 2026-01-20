import os
from dotenv import load_dotenv
from schedule_client import ScheduleApiClient
import pandas as pd

def main():
    load_dotenv()

    API_URL = os.getenv("API_URL")
    user_street_id = os.getenv("user_street_id")
    user_address_id = os.getenv("user_address_id")

    user_street_id = "aa600d9a-6783-4936-9811-3e4870fffb4c"
    user_address_id = "00cc1a01-ad5b-483e-8458-6680b0a34050"

    schedule_client = ScheduleApiClient(API_URL)

    streets_json = schedule_client.load_streets()
    # street = streets_json[0]
    addrresses_json = schedule_client.load_addresses(user_street_id)
    # address = addrresses_json[0]
    schedule_json = schedule_client.load_schedule(user_address_id)
    print(schedule_json)

if __name__ == "__main__":
    main()
