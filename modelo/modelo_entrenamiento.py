import json 
import sys
import mysql.connector
import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import StratifiedKFold, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib
import os
from dotenv import load_dotenv
import mysql.connector
from sqlalchemy import create_engine

load_dotenv()

db_host = os.getenv("DB_HOST")
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_name = os.getenv("DB_NAME")

database_url = f"mysql+mysqlconnector://{db_user}:{db_password}@{db_host}/{db_name}"
engine = create_engine(database_url)

id_empresa = int(sys.argv[1])

query = f"""
SELECT ur.user_id, ar.id AS edad, hl.id AS posicion, rl.id AS resp, g.id AS genero, en.id AS estres
FROM user_responses AS ur
INNER JOIN gender AS g ON ur.gender_id = g.id
INNER JOIN age_range AS ar ON ur.age_range_id = ar.id
INNER JOIN hierarchical_level AS hl ON ur.hierarchical_level_id = hl.id
INNER JOIN responsability_level AS rl ON ur.responsability_level_id = rl.id
INNER JOIN user_estres_sessions AS urs ON ur.user_id = urs.user_id
INNER JOIN estres_niveles AS en ON urs.estres_nivel_id = en.id
INNER JOIN users AS u ON ur.user_id = u.id
WHERE u.empresa_id = {id_empresa};
"""

database_url = f"mysql+mysqlconnector://{db_user}:{db_password}@{db_host}/{db_name}"
engine = create_engine(database_url)

id_empresa = int(sys.argv[1])

query = f"""
SELECT ur.user_id, ar.id AS edad, hl.id AS posicion, rl.id AS resp, g.id AS genero, en.id AS estres
FROM user_responses AS ur
INNER JOIN gender AS g ON ur.gender_id = g.id
INNER JOIN age_range AS ar ON ur.age_range_id = ar.id
INNER JOIN hierarchical_level AS hl ON ur.hierarchical_level_id = hl.id
INNER JOIN responsability_level AS rl ON ur.responsability_level_id = rl.id
INNER JOIN user_estres_sessions AS urs ON ur.user_id = urs.user_id
INNER JOIN estres_niveles AS en ON urs.estres_nivel_id = en.id
INNER JOIN users AS u ON ur.user_id = u.id
WHERE u.empresa_id = {id_empresa};
"""
try:
    df = pd.read_sql(query, engine)
    #print(f"Conexión exitosa, registros obtenidos: {len(df)}")
except Exception as e:
    print(f"Error al ejecutar la consulta: {e}")
    sys.exit()

if df.empty:
    output_json = {
        "mensaje": "No hay datos disponibles para la empresa con id_empresa: " + str(id_empresa)
    }
    print(json.dumps(output_json, indent=4))
    sys.exit() 

df = df.fillna(df.mean())
df['genero'] = df['genero'].fillna('desconocido')


X = df.drop(columns=['estres'])
y = df['estres']

X['genero'] = LabelEncoder().fit_transform(X['genero'])

preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), ['edad', 'posicion', 'resp']),
        ('cat', 'passthrough', ['genero'])
    ]
)

model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier())
])

stratified_kfold = StratifiedKFold(n_splits=3)
param_grid = {
    'classifier__n_estimators': [100, 200],
    'classifier__max_depth': [None, 10, 20]
}
grid_search = GridSearchCV(model, param_grid, cv=stratified_kfold, n_jobs=None)

try:
    grid_search.fit(X, y)
   # print(f"Mejores parámetros encontrados: {grid_search.best_params_}")
except Exception as e:
    print(f"Error durante el entrenamiento del modelo: {e}")
    sys.exit()

best_model = grid_search.best_estimator_

importances = best_model.named_steps['classifier'].feature_importances_
features = ['edad', 'posicion', 'resp', 'genero']
feature_importances = pd.DataFrame({'Feature': features, 'Importance': importances})

feature_importances = feature_importances.sort_values(by='Importance', ascending=False)

output_json = {
    "empresa": id_empresa,
    "mejores_parametros": grid_search.best_params_,
    "importancia_de_caracteristicas": feature_importances.to_dict(orient='records'),
}

print(json.dumps(output_json, indent=4))

joblib.dump(best_model, 'modelo.pkl')
