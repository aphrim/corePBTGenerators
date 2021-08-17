from pbtGenerator import pbtGenerator

# Example Usage
myPBT = pbtGenerator({"templateName": 'EpicPythonGeneratedTemplate#2'})
myPBT.addMesh('testMesh', 'sm_cube_002', {"position": {"X" : 0, "Y": 99, "Z" : 0}})
myPBT.addMesh('otherMesh', 'sm_cube_002', {"rotation" : {"X" : 100, "Y" : 360, "Z" : 10}})
myPBT.addMesh('nextMesh', 'sm_cube_002', {"scale" : {"X" : 99999, "Y" : 20, "Z" : 10}})
print(myPBT.generatePBT())