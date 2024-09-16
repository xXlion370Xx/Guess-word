from pydantic import BaseModel, Field
from typing import Optional

class CreateModel(BaseModel):
    nickname :  str
    owner     :  Optional[bool] = Field(default=True) 

    model_config  ={
        "json_schema_extra":{
            "examples":[
                {
                    "nickname":"Example Name"
                }
            ]
        }
    }
