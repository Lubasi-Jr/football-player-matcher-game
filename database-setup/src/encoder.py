import uuid

example_string = "trent alexanderarnolddefenderenglang23/05/1992"
example_string_2 = "trent alexanderarnolddefenderenglang23/05/1992"

encoded1 = uuid.uuid3(uuid.NAMESPACE_DNS,example_string)
encoded2 = uuid.uuid3(uuid.NAMESPACE_DNS,example_string_2)

print(encoded1)
print(encoded2)