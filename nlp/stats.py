import json
from json import JSONEncoder

class Stat:  
  def __init__(self, losses, time):
    self.losses = losses
    self.time = time

def make_stat(losses, time):
  stat = Stat(losses, time)
  return stat

class StatEncoder(JSONEncoder):
  def default(self, o):
    return o.__dict__