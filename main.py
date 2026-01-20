import os
from dotenv import load_dotenv
from schedule_client import ScheduleApiClient
import pandas as pd

import os
from dotenv import load_dotenv
from schedule_client import ScheduleApiClient
import pandas as pd

def main():
    load_dotenv()

    API_URL = os.getenv("API_URL")
    user_street_id = os.getenv("user_street_id")
    user_address_id = os.getenv("user_address_id")

    schedule_client = ScheduleApiClient(API_URL)

    streets_json = schedule_client.load_streets()
    # street = streets_json[0]
    addrresses_json = schedule_client.load_addresses(user_street_id)
    # address = addrresses_json[0]
    schedule_json = schedule_client.load_schedule(user_address_id)
    print(schedule_json)

if __name__ == "__main__":
    main()
