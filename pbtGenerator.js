function generateID() {
    return Number((Math.floor(Math.random() * Math.pow(10,12)) + "").substring(0, 10))
}

class Object {
    constructor(tableParams) {
        this.name = tableParams.name
        this.position = tableParams.position
        this.rotation = tableParams.rotation
        this.scale = tableParams.scale
        this.parentId = tableParams.parentId
        this.meshId = tableParams.meshId
        this.id = generateID()
    }
}

class pbtGenerator {
    constructor(tableParams) {
        this.templateId = generateID()
        this.templateName = tableParams.templateName
        this.rootId = generateID()
        this.objects = [] // Object[]
        this.meshIds = [] //{id, name}[]
    }

    //Returns the mesh id for the mesh name
    getMeshIdForName(meshName) {
        this.meshIds.forEach(mesh => {
            if (mesh.name = meshName) {
                return mesh.id
            }
        })

        let newMeshId = {id: generateID(), name: meshName}
        this.meshIds.push(newMeshId)
        return newMeshId.id
    }
    
    //Adds a mesh to the template
    addMesh(name, meshName, tableParams) {
        let meshToAdd = new Object(
            {
                 name:     name,
                 position: tableParams.position,
                 rotation: tableParams.rotation,
                 scale:    tableParams.scale,
                 parentId: tableParams.parentId,
                 meshId:   this.getMeshIdForName(meshName),
                 id:       generateID()
            }         
        )
        
        if (meshToAdd.parentId == undefined) {
            meshToAdd.parentId = this.rootId
        }

        if (meshToAdd.position == undefined) {
            meshToAdd.position = 
            {
                X: 0,
                Y: 0,
                Z: 0
            }
        }

        if (meshToAdd.rotation == undefined) {
            meshToAdd.rotation = 
            {
                Pitch: 0,
                Yaw: 0,
                Roll: 0,
            }
        }

        if (meshToAdd.scale == undefined) {
            meshToAdd.scale = 
            {
                X: 1,
                Y: 1,
                Z: 1
            }
        }

        this.objects.push(meshToAdd)
        return meshToAdd
    }

    //Returns a string of all the child IDs
    childrenToString() {
        let childrenString = ''
        this.objects.forEach(object => {
            childrenString = `${childrenString}\n       ChildIds: ${object.id}`
        })
        return childrenString
    }

    //Returns a string containing the part of the PBT with all the objects
    allObjectsPBT() {
        let allObjectsString = ''
        this.objects.forEach(object => {
            let objectString = `
            Objects {
                Id: ${object.id}
                Name: "${object.name}"
                Transform {
                  Location {
                    X: ${object.position.X}
                    Y: ${object.position.Y}
                    Z: ${object.position.Z}
                  }
                  Rotation {
                    Pitch: ${object.rotation.Pitch}
                    Yaw: ${object.rotation.Yaw}
                    Roll: ${object.rotation.Roll}
                  }
                  Scale {
                    X: ${object.scale.X}
                    Y: ${object.scale.Y}
                    Z: ${object.scale.Z}
                  }
                }
                ParentId: ${this.rootId}
                Collidable_v2 {
                  Value: "mc:ecollisionsetting:inheritfromparent"
                }
                Visible_v2 {
                  Value: "mc:evisibilitysetting:inheritfromparent"
                }
                CameraCollidable {
                  Value: "mc:ecollisionsetting:inheritfromparent"
                }
                EditorIndicatorVisibility {
                  Value: "mc:eindicatorvisibility:visiblewhenselected"
                }
                CoreMesh {
                  MeshAsset {
                    Id: ${object.meshId}
                  }
                  Teams {
                    IsTeamCollisionEnabled: true
                    IsEnemyCollisionEnabled: true
                  }
                  StaticMesh {
                    Physics {
                      Mass: 100
                      LinearDamping: 0.01
                    }
                    BoundsScale: 1
                  }
                }
            }\n
            `
            allObjectsString = `${allObjectsString}\n${objectString}`
        })
        return allObjectsString
    }

    objectAssetsPBT() {
        let assetsString = ''
        this.meshIds.forEach(meshId => {
            let meshAssetString = `
            Assets {
                Id: ${meshId.id}
                Name: "${meshId.name}"
                PlatformAssetType: 1
                PrimaryAsset {
                  AssetType: "StaticMeshAssetRef"
                  AssetId: "${meshId.name}"
                }
            }
            `
            assetsString = `${assetsString}\n${meshAssetString}`
        })
        return assetsString
    }

    generatePBT() {
        let pbt = `
        Assets {
            Id: ${this.templateId}
            Name: "${this.templateName}"
            PlatformAssetType: 5
            TemplateAsset {
              ObjectBlock {
                RootId: ${this.rootId}
                Objects {
                  Id: ${this.rootId}
                  Name: "Group"
                  Transform {
                    Location {
                    }
                    Rotation {
                    }
                    Scale {
                      X: 1
                      Y: 1
                      Z: 1
                    }
                  }${this.childrenToString()}
                  Folder {
                    IsGroup: true
                  }
                }
                ${this.allObjectsPBT()}
              }
              ${this.objectAssetsPBT()}
              PrimaryAssetId {
                  AssetType: "None"
                  AssetId: "None"
              }  
            }
          SerializationVersion: 92
        }`
        return pbt
    }

}

module.exports = {pbtGenerator}
