g_matchExpressionFormat = [
    [
        ['x+y+z','x+y+z'] , 
        ['x+z+y', 'x+z+y'] , 
        ['y+x+z', 'y+x+z'] , 
        ['y+z+x', 'y+z+x'] , 
        ['z+x+y', 'z+x+y'] , 
        ['z+y+x', 'z+y+x']
    ],
    [
        ['x-y+z', 'x-y+z'] ,
        ['x+z-y', 'x+z-y'] , 
        ['-y+x+z', '-y+x+z'] , 
        ['-y+z+x', '-y+z+x'] , 
        ['z+x-y', 'z+x-y'] , 
        ['z-y+x', 'z-y+x']
    ],
    [
        ['x*y+z', 'x*y+z'] ,  
        ['z+x*y', 'z+x*y'] , 
        ['y*x+z', 'y*x+z'] , 
        ['z+y*x', 'z+y*x']
    ],
    [
        ['x+y/z+w', 'x+y/z+w'] ,  
        ['w+y/z+x', 'w+y/z+x'] ,         
        ['y/z+x+w', 'y/z+x+w'] , 
        ['y/z+w+x', 'y/z+w+x'] , 
        ['x+w+y/z', 'x+w+y/z'] , 
        ['w+x+y/z', 'w+x+y/z']
    ],
    [
        ['m*x+n*x', 'm*x+n*x'] , 
        ['m*x+x*n', 'm*x+x*n'] , 
        ['n*x+m*x', 'n*x+m*x'] , 
        ['n*x+x*m', 'n*x+x*m'] , 
        ['x*n+m*x', 'x*n+m*x'] , 
        ['x*n+x*m', 'x*n+x*m'] , 
        ['x*m+n*x', 'x*m+n*x'] , 
        ['x*m+x*n', 'x*m+x*n'] , 
        ['(m+n)*x', '(m+n)*x'] , 
        ['x*(m+n)', 'x*(m+n)'] , 
        ['(n+m)*x', '(n+m)*x'] , 
        ['x*(n+m)', 'x*(n+m)']
    ],
    [
        ['a*b-c*d', 'a*b-c*d'] , 
        ['c*d-a*b', 'c*d-a*b'] , 
        ['b*a-c*d', 'b*a-c*d'] , 
        ['c*d-b*a', 'c*d-b*a'] , 
        ['a*b-d*c', 'a*b-d*c'] , 
        ['d*c-a*b', 'd*c-a*b'] , 
        ['b*a-d*c', 'b*a-d*c'] , 
        ['d*c-b*a', 'd*c-b*a'] , 
    ],
    [
        ['p*w+t*w', 'p*w+t*w'] ,  
        ['t*w+p*w', 't*w+p*w'] , 
        ['(p+t)*w', '(p+t)*w'] , 
        ['w*(p+t)', 'w*(p+t)'] , 
        ['(t+p)*w', '(t+p)*w'] , 
        ['w*(t+p)', 'w*(t+p)']
    ],
    [
        ['a*m-b*m+c', 'a*m-b*m+c'] ,  
        ['-b*m+a*m+c', '-b*m+a*m+c'] , 
        ['m*a-b*m+c', 'm*a-b*m+c'] , 
        ['a*m-m*b+c', 'a*m-m*b+c'] , 
        ['c+a*m-b*m', 'c+a*m-b*m'] , 
        ['c+m*a-b*m', 'c+m*a-b*m'] , 
        ['c+m*a-m*b', 'c+m*a-m*b'] , 
        ['c+a*m-b*m', 'c+a*m-b*m']
        
    ],
    [
        ['n/x+m/x', 'ⁿ/ₓ+ᵐ/ₓ'] , 
        ['m/x+n/x', 'ᵐ/ₓ+ⁿ/ₓ'] , 
        ['1/x*(m+n)', '¹/ₓ*(m+n)'] , 
        ['(m+n)*1/x', '(m+n)*¹/ₓ'] , 
        ['1/x*(n+m)', '¹/ₓ*(n+m)'] , 
        ['(n+m)*1/x', '(n+m)*¹/ₓ']
    ],
    [
        ['t*p/c', 't*ᵖ/c'] ,  
        ['p/c*t', 'ᵖ/c*t']
    ]
]
g_matchEqProblemsFormat = [
        [
              'x=y'
            , 'x-y=0'
            , '-y+x=0'
            , 'y=x'
            , '-y=-x'
            , '-x=-y'
            , '0=x-y'
            , '0=-y+x'
        ],
    ]
    
g_solveForXEqProblemsFormat = [
        [
              'x+N=N'
            , 'x-N=N'
            , 'N*x=N'
            , 'x/N=N'
        ],
        [
              'Nx+N=N'
            , 'Nx=N+N'
            , 'x+x=N'
            , 'N=x+x'
        ]
        
    ]
     
g_simplifyExpressionFormat =[
         [
               ['N*N','N*N']
             , ['N+N','N+N']
             , ['N/N','ᴺ/ₙ']
             , ['N-N','N-N']
         ],
         
         [
               ['N+N-N','N+N-N']
             , ['N-N+N','N-N+N']
             , ['N*N*N','N*N*N']
             , ['N+N+N','N+N+N']
             , ['N-N-N','N-N-N']
         ],
         
         [
               ['N*N-N','N*N-N']
             , ['N+N*N','N+N*N']
             , ['N*N+N','N*N+N']
             , ['N*N+N','N*N+N']
             , ['N*N+N','N*N+N']
         ],
        [
             ['N+N/N-N','N+ᴺ/ₙ-N']
            ,['N-N/N+N','N-ᴺ/ₙ+N']
            ,['N/N-N','ᴺ/ₙ-N']
            ,['N/N+N','ᴺ/ₙ+N']
            ,['N+N/N+N','N+ᴺ/ₙ+N']
            ,['N-N/N-N','N-ᴺ/ₙ-N']
        ],
    [
            ['N+N/N-N*N','N+ᴺ/ₙ-N*N']
            ,['N-N/N+N/N','N-ᴺ/ₙ+ᴺ/ₙ']
            ,['N/N-N*N-N','ᴺ/ₙ-N*N-N']
            ,['N/N+N/N*N','ᴺ/ₙ+ᴺ/ₙ*N']
            ,['N+N*N+N-N','N+N*N+N-N']
            ,['N-N/N-N+N','N-ᴺ/ₙ-N+N']  
    ],
         [
               ['N*(N+N)','N*(N+N)']
             , ['N+(N*N)','N+(N*N)']
             , ['(N+N)*N','(N+N)*N']
             , ['(N*N)+N','(N*N)+N']
             , ['N*(N-N)','N*(N-N)']
             , ['N-(N*N)','N-(N*N)']
             , ['(N-N)*N','(N-N)*N']
             , ['(N*N)-N','(N*N)-N']
         ],
    
        [
               ['N*(N+N)+N','N*(N+N)+N']
             , ['N*(N+N)-N','N*(N+N)-N']
             , ['N*(N-N)+N','N*(N-N)+N']
             , ['N*(N-N)-N','N*(N-N)-N']
             , ['N+(N+N)*N','N+(N+N)*N']
             , ['N-(N+N)*N','N-(N+N)*N']
             , ['N+(N-N)*N','N+(N-N)*N']
             , ['N-(N-N)*N','N-(N-N)*N']
         ],
         [
               ['N/N+N/N','ᴺ/ₙ+ᴺ/ₙ']
             , ['N/N-N/N','ᴺ/ₙ-ᴺ/ₙ']
             , ['N/N*N/N','ᴺ/ₙ*ᴺ/ₙ']
         ],
         [
               ['N*N/N','N*ᴺ/ₙ']
             , ['N/N*N','ᴺ/ₙ*N']
             , ['N/N*N/N','ᴺ/ₙ*ᴺ/ₙ']
             , ['N/N/N/N','ᴺ/ₙ/ᴺ/ₙ']
         ]
     ]