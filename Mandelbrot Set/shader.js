const vertSource = `
    attribute vec4 aPos;

    void main() {
        gl_Position = aPos;
    }
`;

const fragSource = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
    #else
        precision highp float;
    #endif

    uniform vec2 screen;
    uniform vec2 position;
    uniform int zoom;
    uniform float time;
    uniform int cursor;
    uniform float distance;
    uniform int colorF;

    vec3 hsv2rgb(vec3 c){
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
    
    vec3 color_interpolation(vec3 c1, vec3 c2, float i){
        return c1 * (1.0 - i) + c2 * i;
    }
    
    vec3 F_COL_1(float i){
        float hue = i/time;
        float saturation = 255.0 / 255.0;
        float value = 255.0 / 255.0;
        
        return hsv2rgb(vec3(hue,saturation,value));
    }

    float modI(float a,float b) {
        float m=a-floor((a+0.5)/b)*b;
        return floor(m+0.5);
    }
    
    vec3 F_COL_2(float i){
        float saturation = 255.0 / 255.0;
        float value = 255.0 / 255.0;
        float hue = modI(pow((i / time) * 360.0, 1.5), 360.0) / 255.0;
    
        return hsv2rgb(vec3(hue,saturation,value));
    }
    
    vec3 F_COL_3(float i){
        float il = (i/time) * (255.0*255.0*255.0);
    
        float r = float(il / (255.0*255.0)) / 255.0;
        float g = modI((il / 255.0), 255.0) / 255.0;
        float b = modI(il, 255.0) / 255.0;
    
        return vec3(r,g,b);
    }
    
    vec3 F_COL_4(float i){
        vec3 c1 = F_COL_3(i);
        vec3 c2 = F_COL_3(i+1.0);
    
        return color_interpolation(c1, c2, i);
    }
    
    vec3 F_COL_5(float i){
        vec3 f = normalize(vec3(i/time, time/i, i));
        f = normalize(vec3(i/time, f.yz));
        return vec3(i/time, f.yz);
    }

    vec3 F_COL_6(float i){
        return vec3(i/time,i/time,i/time);
    }

    void main() {
        vec2 pos = gl_FragCoord.xy - vec2(screen.x, screen.y)/vec2(2,2);
        vec3 color = vec3(0,0,0);

        if(length(pos) < 2.0 && cursor == 1){
            color = vec3(1,1,1);
            return;
        }

        vec2 dp = (pos/vec2(zoom,zoom)) - position;
        vec2 r = dp;

        for(float i = 0.0; i > -1.0; i+=1.0){
            float indexer = i;

            if(indexer >= time){
                break;
            }

            float d = (r.x * r.x) - (r.y * r.y) + dp.x;
            r = vec2(d, 2.0 * (r.x * r.y) + dp.y);

            if(d > distance){
                if(colorF == 1){
                    color = F_COL_1(i);
                }else if(colorF == 2){
                    color = F_COL_2(i);
                }else if(colorF == 3){
                    color = F_COL_3(i);
                }else if(colorF == 4){
                    color = F_COL_4(i);
                }else if(colorF == 5){
                    color = F_COL_5(i);
                }else if(colorF == 6){
                    color = F_COL_6(i);
                }
            }
        }

        gl_FragColor = vec4(color,1);
    }
`;