export default function CreatedModifiedBy({ usersMap, project }) {
    const createdBy = usersMap[project.createdBy]; // pega o objeto do usuário que criou o projeto (usando o createdBy que veio do Firebase)
    const lastModifiedBy = usersMap[project.lastModifiedBy]; // agora pega quem editou pela última vez

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 4,
            }}
        >
            {createdBy && (
                <span className="text-[10px] text-text-muted">
                    Criado por{" "}
                    <span className="text-text-secondary font-semibold">
                        {createdBy.name}
                    </span>
                </span>
            )}
            {lastModifiedBy && project.lastModified && (
                <span className="text-[10px] text-text-muted">
                    Últ. Edição por{" "}
                    <span className="text-text-secondary font-semibold">
                        {lastModifiedBy.name}
                    </span>
                </span>
            )}
        </div>
    );
}
