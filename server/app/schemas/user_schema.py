from pydantic import BaseModel, Field
from typing import Optional

class UserInfoModel(BaseModel):
    user_name :  str
    owner     :  Optional[bool] = Field(default=True) 
    room_id   :  Optional[str] = Field(default=None)

    model_config  ={
        "json_schema_extra":{
            "examples":[
                {
                    "user_name":"Example Name"
                }
            ]
        }
    }
