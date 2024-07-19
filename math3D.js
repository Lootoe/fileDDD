
export function determinant(matrix) {
    // 实现 4x4 矩阵行列式计算
    const [
        [a, b, c, d],
        [e, f, g, h],
        [i, j, k, l],
        [m, n, o, p]
    ] = matrix

    return a * determinant3x3(f, g, h, j, k, l, n, o, p) -
        b * determinant3x3(e, g, h, i, k, l, m, o, p) +
        c * determinant3x3(e, f, h, i, j, l, m, n, p) -
        d * determinant3x3(e, f, g, i, j, k, m, n, o)
}

export function determinant3x3(a, b, c, d, e, f, g, h, i) {
    return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g)
}

export function subtract(p1, p2) {
    return new Point(p1.x - p2.x, p1.y - p2.y, p1.z - p2.z)
}

export function dot(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y + p1.z * p2.z
}

export function cross(p1, p2) {
    return new Point(
        p1.y * p2.z - p1.z * p2.y,
        p1.z * p2.x - p1.x * p2.z,
        p1.x * p2.y - p1.y * p2.x
    )
}

export function calculateCircumsphere(p1, p2, p3, p4) {
    // 使用矩阵方法计算四面体外接球心和半径
    // 详情参考：https://mathworld.wolfram.com/Circumsphere.html

    const A = [
        [p1.x, p1.y, p1.z, 1],
        [p2.x, p2.y, p2.z, 1],
        [p3.x, p3.y, p3.z, 1],
        [p4.x, p4.y, p4.z, 1]
    ]

    const dx = [
        [p1.x * p1.x + p1.y * p1.y + p1.z * p1.z, p1.y, p1.z, 1],
        [p2.x * p2.x + p2.y * p2.y + p2.z * p2.z, p2.y, p2.z, 1],
        [p3.x * p3.x + p3.y * p3.y + p3.z * p3.z, p3.y, p3.z, 1],
        [p4.x * p4.x + p4.y * p4.y + p4.z * p4.z, p4.y, p4.z, 1]
    ]

    const dy = [
        [p1.x * p1.x + p1.y * p1.y + p1.z * p1.z, p1.x, p1.z, 1],
        [p2.x * p2.x + p2.y * p2.y + p2.z * p2.z, p2.x, p2.z, 1],
        [p3.x * p3.x + p3.y * p3.y + p3.z * p3.z, p3.x, p3.z, 1],
        [p4.x * p4.x + p4.y * p4.y + p4.z * p4.z, p4.x, p4.z, 1]
    ]

    const dz = [
        [p1.x * p1.x + p1.y * p1.y + p1.z * p1.z, p1.x, p1.y, 1],
        [p2.x * p2.x + p2.y * p2.y + p2.z * p2.z, p2.x, p2.y, 1],
        [p3.x * p3.x + p3.y * p3.y + p3.z * p3.z, p3.x, p3.y, 1],
        [p4.x * p4.x + p4.y * p4.y + p4.z * p4.z, p4.x, p4.y, 1]
    ]

    const d = [
        [p1.x * p1.x + p1.y * p1.y + p1.z * p1.z, p1.x, p1.y, p1.z],
        [p2.x * p2.x + p2.y * p2.y + p2.z * p2.z, p2.x, p2.y, p2.z],
        [p3.x * p3.x + p3.y * p3.y + p3.z * p3.z, p3.x, p3.y, p3.z],
        [p4.x * p4.x + p4.y * p4.y + p4.z * p4.z, p4.x, p4.y, p4.z]
    ]

    const detA = determinant(A)
    const detDx = determinant(dx)
    const detDy = determinant(dy)
    const detDz = determinant(dz)
    const detD = determinant(d)

    const centerX = detDx / (2 * detA)
    const centerY = detDy / (2 * detA)
    const centerZ = detDz / (2 * detA)

    const radius = Math.sqrt(
        centerX * centerX +
        centerY * centerY +
        centerZ * centerZ -
        detD / detA
    )

    return {
        center: { x: centerX, y: centerY, z: centerZ },
        radius: radius
    }
}

export function volume(p1, p2, p3, p4) {
    return Math.abs(
        (p2.x - p1.x) * (p3.y - p1.y) * (p4.z - p1.z) +
        (p3.x - p1.x) * (p4.y - p1.y) * (p2.z - p1.z) +
        (p4.x - p1.x) * (p2.y - p1.y) * (p3.z - p1.z) -
        (p4.x - p1.x) * (p3.y - p1.y) * (p2.z - p1.z) -
        (p3.x - p1.x) * (p2.y - p1.y) * (p4.z - p1.z) -
        (p2.x - p1.x) * (p4.y - p1.y) * (p3.z - p1.z)
    ) / 6
}