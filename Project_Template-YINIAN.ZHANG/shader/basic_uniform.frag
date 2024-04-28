#version 460
out vec4 FragColor;

in vec3 Normal;
in vec2 Texcoord;
in vec3 FragPos;
in vec4 shadowPos;

uniform vec3 lightPosition;
uniform vec3 lightColor;
uniform vec3 lightAmbient;
uniform vec3 lightDiffuse;
uniform vec3 lightSpecular;
uniform vec3 matAmbient;
uniform vec3 matDiffuse;
uniform vec3 matSpecular;
uniform float matShininess;
uniform vec3 viewPos;  

uniform float roughness;  
uniform float metallic;  
uniform int useTexture;

uniform sampler2D myTexture;
uniform sampler2DShadow shadowTex;

#define PI 3.141592653

vec3 diffColor;

float ggxDistribution(float nDotH) {
    float alpha2 = pow(roughness, 4);
    float d = (nDotH * nDotH) * (alpha2 - 1) + 1;
    return step(0, nDotH) * alpha2 / (PI * d * d);
}
float geomsmith(float dotProd) {
    float k = (roughness + 1.0) * (roughness + 1.0) / 8.0;
    float denom = dotProd * (1 - k) + k;
    return 1.0 / denom;
}
vec3 schlickFresnel(float lDotH) {
    vec3 fo = mix(vec3(0.04), diffColor, metallic);
    return fo + (1 - fo) * pow(1.0 - lDotH, 5);
}

vec3 microfacetModel() {
    vec3 diffuseBrdf = vec3(0.0);  // Metallicif( !Material.Metal )f
    diffuseBrdf = diffColor;
    vec3 l = lightPosition - FragPos;

    float dist = length(l);
    l = normalize(l);
    vec3 lightI = lightColor / (dist * dist);
    vec3 v = normalize(viewPos - FragPos);
    vec3 h = normalize(v + l);
    float nDotH = dot(Normal, h);
    float lDotH = dot(l, h);
    float nDotL = max(dot(Normal, l), 0.0);
    float nDotV = dot(Normal, v);
    vec3 specBrdf = 0.25 * ggxDistribution(nDotH) * schlickFresnel(lDotH) * geomsmith(nDotL) * geomsmith(nDotV);
    return (diffuseBrdf + PI * specBrdf) * lightI * nDotL;
    // return (PI * specBrdf) * lightI * nDotL;
    // return vec3(ggxDistribution(nDotH));
    // return vec3(nDotH);
}

void main() {
    // FragColor=vec4(Normal,1);
    // return;
    vec3 shadowP = shadowPos.xyz / shadowPos.w * 0.5 + 0.5;
    float shadow = texture(shadowTex, shadowP);

    if(useTexture==1)
    diffColor = texture(myTexture, Texcoord).rgb;
    else
    diffColor = matDiffuse;

    // ambient
    vec3 ambient = lightAmbient * matAmbient * diffColor;
  	
    // diffuse 
    // vec3 norm = normalize(Normal);
    // vec3 lightDir = normalize(lightPosition - FragPos);
    // float diff = max(dot(norm, lightDir), 0.0);
    // vec3 diffuse = lightDiffuse * (diff * matDiffuse) * diffColor;
    
    // // specular
    // vec3 viewDir = normalize(viewPos - FragPos);
    // vec3 reflectDir = reflect(-lightDir, norm);  
    // float spec = pow(max(dot(viewDir, reflectDir), 0.0), matShininess);
    // vec3 specular = lightSpecular * (spec * matSpecular);
    vec3 col = microfacetModel();
    vec3 result = ambient + shadow * col;
    // vec3 result =  col;
    FragColor = vec4(result, 1.0);
}