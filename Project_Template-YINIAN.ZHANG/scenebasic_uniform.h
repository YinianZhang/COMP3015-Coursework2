#ifndef SCENEBASIC_UNIFORM_H
#define SCENEBASIC_UNIFORM_H

#include "helper/scene.h"

#include <glad/glad.h>
#include "helper/glslprogram.h"

#include "camera.h"
#include "helper/objmesh.h"
#include "helper/skybox.h"
class SceneBasic_Uniform : public Scene
{
private:
    GLuint vaoHandle;
    GLSLProgram prog;
    float angle;
    bool isStartRotate;
    Camera camera;

    GLSLProgram skyboxProj;
    unsigned int cubemapTexture;
    unsigned int woodTexture;
    unsigned int sofaTexture;

    std::unique_ptr<TriangleMesh> pMesh;
    std::unique_ptr<TriangleMesh> pMesh2;
    std::unique_ptr<TriangleMesh> pSkyBox;
    void compile();

    void renderScene(GLSLProgram &program, glm::mat4 const &V,glm::mat4 const &P,glm::mat4 const &lightPV);

    void renderShadow(GLSLProgram &program, glm::mat4 const viewMatrix, glm::mat4 const proj);

    glm::vec3 lightPosition;

    GLSLProgram shadowProg;
    GLuint shadowFbo;
    GLuint shadowDepthTex;

public:
    SceneBasic_Uniform();

    void initScene();
    void update( float t );
    void render();
    void resize(int, int);
    bool processKey(int value);
    void processMousePos(float xpos, float ypos);
};

#endif // SCENEBASIC_UNIFORM_H
