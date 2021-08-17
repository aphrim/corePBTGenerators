import random

def generateId():
    return str((random.random() * pow(10,12)))[0:10]

class Object:
    def __init__(self, tableParams):
        self.name = tableParams.get("name")
        self.position = tableParams.get("position")
        self.rotation = tableParams.get("rotation")
        self.scale = tableParams.get("scale")
        self.parentId = tableParams.get("parentId")
        self.meshId = tableParams.get("meshId")
        self.id = generateId()

class pbtGenerator:
    def __init__(self, tableParams):
        self.templateName = tableParams["templateName"]
        self.templateId = generateId()
        self.rootId = generateId()
        self.objects = []
        self.meshIds = []
    
    def getMeshIdForName(self, meshName):
        for mesh in self.meshIds:
            if (mesh.get("name") == meshName):
                return mesh.get("id")
        newMeshId = {"id": generateId(), "name": meshName}
        self.meshIds.append(newMeshId)
        return newMeshId["id"]
    
    def addMesh(self, name, meshName, tableParams):
        meshToAdd = Object(
        {
            "name": name,
            "position": tableParams.get("position"),
            "rotation": tableParams.get("rotation"),
            "scale": tableParams.get("scale"),
            "parentId": tableParams.get("parentId"),
            "meshId": self.getMeshIdForName(meshName),
            "id": generateId()
        })

        if (meshToAdd.parentId is None):
            meshToAdd.parentId = self.rootId

        if (meshToAdd.position is None):
            meshToAdd.position = {"X" : 0, "Y" : 0, "Z" : 0}

        if (meshToAdd.rotation is None):
            meshToAdd.rotation = {"X" : 0, "Y" : 0, "Z" : 0}

        if (meshToAdd.scale is None):
            meshToAdd.scale = {"X" : 0, "Y" : 0, "Z" : 0}
        
        self.objects.append(meshToAdd)
        return meshToAdd
    
    def childrenToString(self):
        childrenString = ""
        for object in self.objects:
            childrenString += "ChildIds: " + object.id + "\n"
        return childrenString

    def allObjectsPBT(self):
        allObjectsString = ""

        for object in self.objects:
            objectString = f'''
                            Objects {{
                                Id: {object.id}
                                Name: "{object.name}"
                                Transform {{
                                    Location {{
                                        X: {object.position["X"]}
                                        Y: {object.position["Y"]}
                                        Z: {object.position["Z"]}
                                    }}
                                    Rotation {{
                                        Pitch: {object.rotation["X"]}
                                        Yaw: {object.rotation["Y"]}
                                        Roll: {object.rotation["Z"]}
                                    }}
                                    Scale {{
                                        X: {object.scale["X"]}
                                        Y: {object.scale["Y"]}
                                        Z: {object.scale["Z"]}
                                    }}
                                }}
                                ParentId: {self.rootId}    
                                Collidable_v2 {{
                                    Value: "mc:ecollisionsetting:inheritfromparent"
                                }}
                                Visible_v2 {{
                                    Value: "mc:evisibilitysetting:inheritfromparent"
                                }}
                                CameraCollidable {{
                                    Value: "mc:ecollisionsetting:inheritfromparent"
                                }}
                                EditorIndicatorVisibility {{
                                    Value: "mc:eindicatorvisibility:visiblewhenselected"
                                }}
                                CoreMesh {{
                                    MeshAsset {{
                                        Id: {object.meshId}
                                    }}
                                    Teams {{
                                        IsTeamCollisionEnabled: true
                                        IsEnemyCollisionEnabled: true
                                    }}
                                    StaticMesh {{
                                        Physics {{
                                            Mass: 100
                                            LinearDamping: 0.01
                                        }}
                                        BoundsScale: 1
                                    }}
                                }}
                            }} \n
                            '''
            allObjectsString += objectString
        return allObjectsString

    def objectAssetsPBT(self):      
        assetsString = ""
        for meshId in self.meshIds:
            meshAssetString = f'''
                Assets {{
                    Id: {meshId['id']}
                    Name: "{meshId['name']}"
                    PlatformAssetType: 1
                    PrimaryAsset {{
                        AssetType: "StaticMeshAssetRef"
                        AssetId: "{meshId['name']}"
                    }}
                }}
            '''
            assetsString += meshAssetString
        return assetsString

    def generatePBT(self):
        pbt = f'''
            Assets {{
                Id: {self.templateId}
                Name: "{self.templateName}"
                PlatformAssetType: 5
                TemplateAsset {{
                    ObjectBlock {{
                        RootId: {self.rootId}
                        Objects {{
                            Id: {self.rootId}
                            Name: "Group"
                            Transform {{
                                Location {{
                                }}
                                Rotation {{
                                }}
                                Scale {{
                                    X: 1
                                    Y: 1
                                    Z: 1
                                }}
                            }}
                            {self.childrenToString()}
                            Folder {{
                                IsGroup: true
                            }}
                        }}
                        {self.allObjectsPBT()}
                    }}
                    {self.objectAssetsPBT()}
                    PrimaryAssetId {{
                        AssetType: "None"
                        AssetId: "None"
                    }}
                }}
                SerializationVersion: 92
            }}
        '''
        return pbt




