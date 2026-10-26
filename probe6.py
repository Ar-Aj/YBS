import struct
for p in ["public/videos/hero-home.mp4","public/videos/hero-home-mobile.mp4","public/videos/hero-home-tablet.mp4","public/logo/ybs-logo-intro.mp4"]:
    with open(p,'rb') as f: data=f.read(200000)
    i=data.find(b'tkhd')
    c=i+8
    w=struct.unpack('>I',data[c+76:c+80])[0]/65536
    h=struct.unpack('>I',data[c+80:c+84])[0]/65536
    print(p.split('/')[-1], w, 'x', h, '->', round(w/h,3))
