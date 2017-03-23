g_matchExpressionFormat = [
    [
          'x+y+z'
        , 'x+z+y'
        , 'y+x+z'
        , 'y+z+x'
        , 'z+x+y'
        , 'z+y+x'
    ],
    [
          'x-y+z'
        , 'x+z-y'
        , '-y+x+z'
        , '-y+z+x'
        , 'z+x-y'
        , 'z-y+x'
    ],
    [
          'x*y+z'
        , 'z+x*y'
        , 'y*x+z'
        , 'z+y*x'
    ],
    [
          'x+y/z+w'
        , 'w+y/z+x'        
        , 'y/z+x+w'
        , 'y/z+w+x'
        , 'x+w+y/z'
        , 'w+x+y/z'
    ],
    [
          'm*x+n*x'
        , 'm*x+x*n'
        , 'n*x+m*x'
        , 'n*x+x*m'
        , 'x*n+m*x'
        , 'x*n+x*m'
        , 'x*m+n*x'
        , 'x*m+x*n'
        , '(m+n)*x'
        , 'x*(m+n)'
        , '(n+m)*x'
        , 'x*(n+m)'
    ],
    [
          'a*b-c*d'
        , 'c*d-a*b'
        , 'b*a-c*d'
        , 'c*d-b*a'
        , 'a*b-d*c'
        , 'd*c-a*b'
        , 'b*a-d*c'
        , 'd*c-b*a'
    ],
    [
          'p*w+t*w'
        , 't*w+p*w'
        , '(p+t)*w'
        , 'w*(p+t)'
        , '(t+p)*w'
        , 'w*(t+p)'
    ],
    [
          'a*m-b*m+c'
        , '-b*m+a*m+c'
        , 'm*a-b*m+c'
        , 'a*m-m*b+c'
        , 'c+a*m-b*m'
        , 'c+m*a-b*m'
        , 'c+m*a-m*b'
        , 'c+a*m-b*m'
        
    ],
    [
          'n/x+m/x'
        , 'm/x+n/x'
        , '1/x*(m+n)'
        , '(m+n)*1/x'
        , '1/x*(n+m)'
        , '(n+m)*1/x'
    ],
    [
          't*p/c'
        , 'p/c*t'
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
               'N*N'
             , 'N+N'
             , 'N/N'
             , 'N-N'
         ],
         
         [
               'N+N-N'
             , 'N-N+N'
             , 'N*N*N'
             , 'N+N+N'
             , 'N-N-N'
         ],
         
         [
               'N*N-N'
             , 'N+N*N'
             , 'N*N+N'
             , 'N*N+N'
             , 'N*N+N'
         ],
        [
             'N+N/N-N'
            ,'N-N/N+N'
            ,'N/N-N'
            ,'N/N+N'
            ,'N+N/N+N'
            ,'N-N/N-N'
        ],
    [
            'N+N/N-N*N'
            ,'N-N/N+N/N'
            ,'N/N-N*N-N'
            ,'N/N+N/N*N'
            ,'N+N*N+N-N'
            ,'N-N/N-N+N'  
    ],
         [
               'N*(N+N)'
             , 'N+(N*N)'
             , '(N+N)*N'
             , '(N*N)+N'
             , 'N*(N-N)'
             , 'N-(N*N)'
             , '(N-N)*N'
             , '(N*N)-N'
         ],
    
        [
               'N*(N+N)+N'
             , 'N*(N+N)-N'
             , 'N*(N-N)+N'
             , 'N*(N-N)-N'
             , 'N+(N+N)*N'
             , 'N-(N+N)*N'
             , 'N+(N-N)*N'
             , 'N-(N-N)*N'
         ],
         [
               'N/N+N/N'
             , 'N/N-N/N'
             , 'N/N*N/N'
         ],
         [
               'N*N/N'
             , 'N/N*N'
             , 'N/N*N/N'
             , 'N/N/N/N'
         ]
     ]